
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using SimpleApps.ToDo.Infrastructure.Data;
using SimpleApps.ToDo.Domain;
using SimpleApps.ToDo.Domain.Repositories.Interfaces;
using SimpleApps.ToDo.Crosscutting.Enums;
using SimpleApps.ToDo.Test.Setup;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Xunit;

namespace SimpleApps.ToDo.Test.Controllers
{
    public class ToDoItemsControllerIntTest
    {
        public ToDoItemsControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _toDoItemRepository = _factory.GetRequiredService<IToDoItemRepository>();


            InitTest();
        }

        private const string DefaultDescription = "AAAAAAAAAA";
        private const string UpdatedDescription = "BBBBBBBBBB";

        private const ItemStatus DefaultStatus = ItemStatus.InProgress;
        private const ItemStatus UpdatedStatus = ItemStatus.InProgress;

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly IToDoItemRepository _toDoItemRepository;

        private ToDoItem _toDoItem;


        private ToDoItem CreateEntity()
        {
            return new ToDoItem
            {
                Description = DefaultDescription,
                Status = DefaultStatus,
            };
        }

        private void InitTest()
        {
            _toDoItem = CreateEntity();
        }

        [Fact]
        public async Task CreateToDoItem()
        {
            var databaseSizeBeforeCreate = await _toDoItemRepository.CountAsync();

            // Create the ToDoItem
            var response = await _client.PostAsync("/api/to-do-items", TestUtil.ToJsonContent(_toDoItem));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the ToDoItem in the database
            var toDoItemList = await _toDoItemRepository.GetAllAsync();
            toDoItemList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testToDoItem = toDoItemList.Last();
            testToDoItem.Description.Should().Be(DefaultDescription);
            testToDoItem.Status.Should().Be(DefaultStatus);
        }

        [Fact]
        public async Task CreateToDoItemWithExistingId()
        {
            var databaseSizeBeforeCreate = await _toDoItemRepository.CountAsync();
            // Create the ToDoItem with an existing ID
            _toDoItem.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            var response = await _client.PostAsync("/api/to-do-items", TestUtil.ToJsonContent(_toDoItem));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the ToDoItem in the database
            var toDoItemList = await _toDoItemRepository.GetAllAsync();
            toDoItemList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task GetAllToDoItems()
        {
            // Initialize the database
            await _toDoItemRepository.CreateOrUpdateAsync(_toDoItem);
            await _toDoItemRepository.SaveChangesAsync();

            // Get all the toDoItemList
            var response = await _client.GetAsync("/api/to-do-items?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_toDoItem.Id);
            json.SelectTokens("$.[*].description").Should().Contain(DefaultDescription);
            json.SelectTokens("$.[*].status").Should().Contain(DefaultStatus.ToString());
        }

        [Fact]
        public async Task GetToDoItem()
        {
            // Initialize the database
            await _toDoItemRepository.CreateOrUpdateAsync(_toDoItem);
            await _toDoItemRepository.SaveChangesAsync();

            // Get the toDoItem
            var response = await _client.GetAsync($"/api/to-do-items/{_toDoItem.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_toDoItem.Id);
            json.SelectTokens("$.description").Should().Contain(DefaultDescription);
            json.SelectTokens("$.status").Should().Contain(DefaultStatus.ToString());
        }

        [Fact]
        public async Task GetNonExistingToDoItem()
        {
            var maxValue = long.MaxValue;
            var response = await _client.GetAsync("/api/to-do-items/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateToDoItem()
        {
            // Initialize the database
            await _toDoItemRepository.CreateOrUpdateAsync(_toDoItem);
            await _toDoItemRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _toDoItemRepository.CountAsync();

            // Update the toDoItem
            var updatedToDoItem = await _toDoItemRepository.QueryHelper().GetOneAsync(it => it.Id == _toDoItem.Id);
            // Disconnect from session so that the updates on updatedToDoItem are not directly saved in db
            //TODO detach
            updatedToDoItem.Description = UpdatedDescription;
            updatedToDoItem.Status = UpdatedStatus;

            var response = await _client.PutAsync($"/api/to-do-items/{_toDoItem.Id}", TestUtil.ToJsonContent(updatedToDoItem));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the ToDoItem in the database
            var toDoItemList = await _toDoItemRepository.GetAllAsync();
            toDoItemList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testToDoItem = toDoItemList.Last();
            testToDoItem.Description.Should().Be(UpdatedDescription);
            testToDoItem.Status.Should().Be(UpdatedStatus);
        }

        [Fact]
        public async Task UpdateNonExistingToDoItem()
        {
            var databaseSizeBeforeUpdate = await _toDoItemRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            var response = await _client.PutAsync("/api/to-do-items/1", TestUtil.ToJsonContent(_toDoItem));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the ToDoItem in the database
            var toDoItemList = await _toDoItemRepository.GetAllAsync();
            toDoItemList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteToDoItem()
        {
            // Initialize the database
            await _toDoItemRepository.CreateOrUpdateAsync(_toDoItem);
            await _toDoItemRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _toDoItemRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/to-do-items/{_toDoItem.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var toDoItemList = await _toDoItemRepository.GetAllAsync();
            toDoItemList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(ToDoItem));
            var toDoItem1 = new ToDoItem
            {
                Id = 1L
            };
            var toDoItem2 = new ToDoItem
            {
                Id = toDoItem1.Id
            };
            toDoItem1.Should().Be(toDoItem2);
            toDoItem2.Id = 2L;
            toDoItem1.Should().NotBe(toDoItem2);
            toDoItem1.Id = 0;
            toDoItem1.Should().NotBe(toDoItem2);
        }
    }
}
