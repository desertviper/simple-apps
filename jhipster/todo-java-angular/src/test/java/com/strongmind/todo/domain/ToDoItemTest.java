package com.strongmind.todo.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.strongmind.todo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ToDoItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ToDoItem.class);
        ToDoItem toDoItem1 = new ToDoItem();
        toDoItem1.setId(1L);
        ToDoItem toDoItem2 = new ToDoItem();
        toDoItem2.setId(toDoItem1.getId());
        assertThat(toDoItem1).isEqualTo(toDoItem2);
        toDoItem2.setId(2L);
        assertThat(toDoItem1).isNotEqualTo(toDoItem2);
        toDoItem1.setId(null);
        assertThat(toDoItem1).isNotEqualTo(toDoItem2);
    }
}
