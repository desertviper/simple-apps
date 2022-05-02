import { entityItemSelector } from "../../support/commands";
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from "../../support/entity";

describe("ToDoItem e2e test", () => {
  const toDoItemPageUrl = "/to-do-item";
  const toDoItemPageUrlPattern = new RegExp("/to-do-item(\\?.*)?$");
  const username = Cypress.env("E2E_USERNAME") ?? "user";
  const password = Cypress.env("E2E_PASSWORD") ?? "user";
  const toDoItemSample = {};

  let toDoItem: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept("GET", "/api/to-do-items+(?*|)").as("entitiesRequest");
    cy.intercept("POST", "/api/to-do-items").as("postEntityRequest");
    cy.intercept("DELETE", "/api/to-do-items/*").as("deleteEntityRequest");
  });

  afterEach(() => {
    if (toDoItem) {
      cy.authenticatedRequest({
        method: "DELETE",
        url: `/api/to-do-items/${toDoItem.id}`,
      }).then(() => {
        toDoItem = undefined;
      });
    }
  });

  it("ToDoItems menu should load ToDoItems page", () => {
    cy.visit("/");
    cy.clickOnEntityMenuItem("to-do-item");
    cy.wait("@entitiesRequest").then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should("not.exist");
      } else {
        cy.get(entityTableSelector).should("exist");
      }
    });
    cy.getEntityHeading("ToDoItem").should("exist");
    cy.url().should("match", toDoItemPageUrlPattern);
  });

  describe("ToDoItem page", () => {
    describe("create button click", () => {
      beforeEach(() => {
        cy.visit(toDoItemPageUrl);
        cy.wait("@entitiesRequest");
      });

      it("should load create ToDoItem page", () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should("match", new RegExp("/to-do-item/new$"));
        cy.getEntityCreateUpdateHeading("ToDoItem");
        cy.get(entityCreateSaveButtonSelector).should("exist");
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait("@entitiesRequest").then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should("match", toDoItemPageUrlPattern);
      });
    });

    describe("with existing value", () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: "POST",
          url: "/api/to-do-items",
          body: toDoItemSample,
        }).then(({ body }) => {
          toDoItem = body;

          cy.intercept(
            {
              method: "GET",
              url: "/api/to-do-items+(?*|)",
              times: 1,
            },
            {
              statusCode: 200,
              body: [toDoItem],
            }
          ).as("entitiesRequestInternal");
        });

        cy.visit(toDoItemPageUrl);

        cy.wait("@entitiesRequestInternal");
      });

      it("detail button click should load details ToDoItem page", () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading("toDoItem");
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait("@entitiesRequest").then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should("match", toDoItemPageUrlPattern);
      });

      it("edit button click should load edit ToDoItem page", () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading("ToDoItem");
        cy.get(entityCreateSaveButtonSelector).should("exist");
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait("@entitiesRequest").then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should("match", toDoItemPageUrlPattern);
      });

      it("last delete button click should delete instance of ToDoItem", () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading("toDoItem").should("exist");
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait("@deleteEntityRequest").then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait("@entitiesRequest").then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should("match", toDoItemPageUrlPattern);

        toDoItem = undefined;
      });
    });
  });

  describe("new ToDoItem page", () => {
    beforeEach(() => {
      cy.visit(`${toDoItemPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading("ToDoItem");
    });

    it("should create an instance of ToDoItem", () => {
      cy.get(`[data-cy="description"]`)
        .type("transmitting Tokelau cross-platform")
        .should("have.value", "transmitting Tokelau cross-platform");

      cy.get(`[data-cy="status"]`).select("InProgress");

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait("@postEntityRequest").then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        toDoItem = response!.body;
      });
      cy.wait("@entitiesRequest").then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should("match", toDoItemPageUrlPattern);
    });
  });
});
