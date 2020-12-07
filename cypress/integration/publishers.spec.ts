import { PublishersPage } from '../page_objects/publishers/Publishers';

context('Publishers', () => {
  const publishersPage = new PublishersPage();

  const searchTerm: string = 'Minute Physics';

  it('search', () => {
    publishersPage.visit().login().search(searchTerm);
  });

  it('should apply filters', () => {
    publishersPage
      .visit()
      .login()
      .search(searchTerm)
      .applyFilters('Educational')
      .applyFilters('Minute Physics')
      .applyFilters('Physics')
      .applyFilters('Up to 1 min');
  });
});
