export const populateDefaultItems = {
  path: 'itemsPrice.item',
  match: {},
  populate: {
    path: 'subItems.options.item complements.item',
    populate: {
      path: 'complements.item',
    },
  },
}
