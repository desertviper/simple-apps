using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SimpleApps.ToDo.Crosscutting.Enums;

namespace SimpleApps.ToDo.Domain
{
    [Table("to_do_item")]
    public class ToDoItem : BaseEntity<long>
    {
        public string Description { get; set; }
        public ItemStatus Status { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var toDoItem = obj as ToDoItem;
            if (toDoItem?.Id == null || toDoItem?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Default.Equals(Id, toDoItem.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "ToDoItem{" +
                    $"ID='{Id}'" +
                    $", Description='{Description}'" +
                    $", Status='{Status}'" +
                    "}";
        }
    }
}
