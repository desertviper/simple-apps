package com.strongmind.todo.web.rest;

import com.strongmind.todo.domain.ToDoItem;
import com.strongmind.todo.repository.ToDoItemRepository;
import com.strongmind.todo.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.strongmind.todo.domain.ToDoItem}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ToDoItemResource {

    private final Logger log = LoggerFactory.getLogger(ToDoItemResource.class);

    private static final String ENTITY_NAME = "toDoItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ToDoItemRepository toDoItemRepository;

    public ToDoItemResource(ToDoItemRepository toDoItemRepository) {
        this.toDoItemRepository = toDoItemRepository;
    }

    /**
     * {@code POST  /to-do-items} : Create a new toDoItem.
     *
     * @param toDoItem the toDoItem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new toDoItem, or with status {@code 400 (Bad Request)} if the toDoItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/to-do-items")
    public ResponseEntity<ToDoItem> createToDoItem(@RequestBody ToDoItem toDoItem) throws URISyntaxException {
        log.debug("REST request to save ToDoItem : {}", toDoItem);
        if (toDoItem.getId() != null) {
            throw new BadRequestAlertException("A new toDoItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ToDoItem result = toDoItemRepository.save(toDoItem);
        return ResponseEntity
            .created(new URI("/api/to-do-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /to-do-items/:id} : Updates an existing toDoItem.
     *
     * @param id the id of the toDoItem to save.
     * @param toDoItem the toDoItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated toDoItem,
     * or with status {@code 400 (Bad Request)} if the toDoItem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the toDoItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/to-do-items/{id}")
    public ResponseEntity<ToDoItem> updateToDoItem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ToDoItem toDoItem
    ) throws URISyntaxException {
        log.debug("REST request to update ToDoItem : {}, {}", id, toDoItem);
        if (toDoItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, toDoItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!toDoItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ToDoItem result = toDoItemRepository.save(toDoItem);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, toDoItem.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /to-do-items/:id} : Partial updates given fields of an existing toDoItem, field will ignore if it is null
     *
     * @param id the id of the toDoItem to save.
     * @param toDoItem the toDoItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated toDoItem,
     * or with status {@code 400 (Bad Request)} if the toDoItem is not valid,
     * or with status {@code 404 (Not Found)} if the toDoItem is not found,
     * or with status {@code 500 (Internal Server Error)} if the toDoItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/to-do-items/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ToDoItem> partialUpdateToDoItem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ToDoItem toDoItem
    ) throws URISyntaxException {
        log.debug("REST request to partial update ToDoItem partially : {}, {}", id, toDoItem);
        if (toDoItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, toDoItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!toDoItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ToDoItem> result = toDoItemRepository
            .findById(toDoItem.getId())
            .map(existingToDoItem -> {
                if (toDoItem.getDescription() != null) {
                    existingToDoItem.setDescription(toDoItem.getDescription());
                }
                if (toDoItem.getStatus() != null) {
                    existingToDoItem.setStatus(toDoItem.getStatus());
                }

                return existingToDoItem;
            })
            .map(toDoItemRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, toDoItem.getId().toString())
        );
    }

    /**
     * {@code GET  /to-do-items} : get all the toDoItems.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of toDoItems in body.
     */
    @GetMapping("/to-do-items")
    public List<ToDoItem> getAllToDoItems(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ToDoItems");
        return toDoItemRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /to-do-items/:id} : get the "id" toDoItem.
     *
     * @param id the id of the toDoItem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the toDoItem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/to-do-items/{id}")
    public ResponseEntity<ToDoItem> getToDoItem(@PathVariable Long id) {
        log.debug("REST request to get ToDoItem : {}", id);
        Optional<ToDoItem> toDoItem = toDoItemRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(toDoItem);
    }

    /**
     * {@code DELETE  /to-do-items/:id} : delete the "id" toDoItem.
     *
     * @param id the id of the toDoItem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/to-do-items/{id}")
    public ResponseEntity<Void> deleteToDoItem(@PathVariable Long id) {
        log.debug("REST request to delete ToDoItem : {}", id);
        toDoItemRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
