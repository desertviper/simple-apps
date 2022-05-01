package com.strongmind.todo.repository;

import com.strongmind.todo.domain.ToDoItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ToDoItem entity.
 */
@Repository
public interface ToDoItemRepository extends JpaRepository<ToDoItem, Long> {
    @Query("select toDoItem from ToDoItem toDoItem where toDoItem.user.login = ?#{principal.username}")
    List<ToDoItem> findByUserIsCurrentUser();

    default Optional<ToDoItem> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ToDoItem> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ToDoItem> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct toDoItem from ToDoItem toDoItem left join fetch toDoItem.user",
        countQuery = "select count(distinct toDoItem) from ToDoItem toDoItem"
    )
    Page<ToDoItem> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct toDoItem from ToDoItem toDoItem left join fetch toDoItem.user")
    List<ToDoItem> findAllWithToOneRelationships();

    @Query("select toDoItem from ToDoItem toDoItem left join fetch toDoItem.user where toDoItem.id =:id")
    Optional<ToDoItem> findOneWithToOneRelationships(@Param("id") Long id);
}
