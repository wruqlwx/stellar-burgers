describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.visit('/');
  });

  describe('Добавление ингредиента из списка в конструктор', () => {
    it('должен добавить ингредиент при клике на кнопку добавления', () => {
      cy.get('ul.burger-ingredients__list').first().find('button').first().click();
      cy.get('section.burger-constructor').should('contain', 'булка');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открыться при клике на название ингредиента', () => {
      cy.get('ul.burger-ingredients__list').first().find('a').first().click();
      cy.get('#modal').should('be.visible');
    });

    it('должно закрыться при клике на кнопку закрытия', () => {
      cy.get('ul.burger-ingredients__list').first().find('a').first().click();
      cy.get('#modal').find('button').first().click();
      cy.get('#modal').should('not.exist');
    });

    it('должно отображать правильные данные ингредиента', () => {
      cy.get('ul.burger-ingredients__list').first().find('a').first().click();
      cy.get('#modal').should('contain', 'Калорийность');
      cy.get('#modal').should('contain', 'Белки');
      cy.get('#modal').should('contain', 'Жиры');
      cy.get('#modal').should('contain', 'Углеводы');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('accessToken', 'Bearer test_token');
        win.document.cookie = 'accessToken=Bearer test_token';
      });
      cy.intercept('POST', '**/orders', {
        statusCode: 200,
        fixture: 'order.json'
      }).as('postOrder');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      cy.window().then((win) => {
        win.localStorage.removeItem('accessToken');
      });
    });

    it('должен оформить заказ и показать номер', () => {
      cy.get('ul.burger-ingredients__list').first().find('button').first().click();
      cy.get('section.burger-constructor').contains('Оформить заказ').click();
      cy.wait('@postOrder');
      cy.get('#modal').should('contain', '12345');
    });

    it('должен очистить конструктор после оформления', () => {
      cy.get('ul.burger-ingredients__list').first().find('button').first().click();
      cy.get('section.burger-constructor').contains('Оформить заказ').click();
      cy.wait('@postOrder');
      cy.get('#modal').find('button').first().click();
      cy.get('section.burger-constructor').should('not.contain', 'булка');
    });
  });
});