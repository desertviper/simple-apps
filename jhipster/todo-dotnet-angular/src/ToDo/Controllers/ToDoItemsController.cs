
using System.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using SimpleApps.ToDo.Domain;
using SimpleApps.ToDo.Crosscutting.Enums;
using SimpleApps.ToDo.Crosscutting.Exceptions;
using SimpleApps.ToDo.Web.Extensions;
using SimpleApps.ToDo.Web.Filters;
using SimpleApps.ToDo.Web.Rest.Utilities;
using SimpleApps.ToDo.Domain.Repositories.Interfaces;
using SimpleApps.ToDo.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace SimpleApps.ToDo.Controllers
{
    [Authorize]
    [Route("api/to-do-items")]
    [ApiController]
    public class ToDoItemsController : ControllerBase
    {
        private const string EntityName = "toDoItem";
        private readonly ILogger<ToDoItemsController> _log;
        private readonly IToDoItemRepository _toDoItemRepository;

        public ToDoItemsController(ILogger<ToDoItemsController> log,
        IToDoItemRepository toDoItemRepository)
        {
            _log = log;
            _toDoItemRepository = toDoItemRepository;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<ToDoItem>> CreateToDoItem([FromBody] ToDoItem toDoItem)
        {
            _log.LogDebug($"REST request to save ToDoItem : {toDoItem}");
            if (toDoItem.Id != 0)
                throw new BadRequestAlertException("A new toDoItem cannot already have an ID", EntityName, "idexists");

            await _toDoItemRepository.CreateOrUpdateAsync(toDoItem);
            await _toDoItemRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetToDoItem), new { id = toDoItem.Id }, toDoItem)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, toDoItem.Id.ToString()));
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateToDoItem(long id, [FromBody] ToDoItem toDoItem)
        {
            _log.LogDebug($"REST request to update ToDoItem : {toDoItem}");
            if (toDoItem.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != toDoItem.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            await _toDoItemRepository.CreateOrUpdateAsync(toDoItem);
            await _toDoItemRepository.SaveChangesAsync();
            return Ok(toDoItem)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, toDoItem.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ToDoItem>>> GetAllToDoItems(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of ToDoItems");
            var result = await _toDoItemRepository.QueryHelper()
                .Include(toDoItem => toDoItem.User)
                .GetPageAsync(pageable);
            return Ok(result.Content).WithHeaders(result.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetToDoItem([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get ToDoItem : {id}");
            var result = await _toDoItemRepository.QueryHelper()
                .Include(toDoItem => toDoItem.User)
                .GetOneAsync(toDoItem => toDoItem.Id == id);
            return ActionResultUtil.WrapOrNotFound(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteToDoItem([FromRoute] long id)
        {
            _log.LogDebug($"REST request to delete ToDoItem : {id}");
            await _toDoItemRepository.DeleteByIdAsync(id);
            await _toDoItemRepository.SaveChangesAsync();
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
