import { By } from '../../support/By';
import { TeacherPage } from './index';

export class DiscoverPage extends TeacherPage {
  public containsCollections() {
    cy.get(By.dataQa('collection-card'))
      .should('be.visible')
      .log('Found at least one collection');
    return this;
  }
}
