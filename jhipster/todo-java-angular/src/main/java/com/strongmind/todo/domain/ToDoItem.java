package com.strongmind.todo.domain;

import com.strongmind.todo.domain.enumeration.ItemStatus;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ToDoItem.
 */
@Entity
@Table(name = "to_do_item")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ToDoItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ItemStatus status;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ToDoItem id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public ToDoItem description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ItemStatus getStatus() {
        return this.status;
    }

    public ToDoItem status(ItemStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(ItemStatus status) {
        this.status = status;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ToDoItem user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ToDoItem)) {
            return false;
        }
        return id != null && id.equals(((ToDoItem) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ToDoItem{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
