// THIS IS A MOCK NOT REAL DATA
// UNTIL API is done :)

export const MOCK_CATEGORIES = [
  {
    _id: '101',
    title: 'Shirts',
    color: 'blue'
  },
  {
    _id: '102',
    title: 'Pants',
    color: 'charcoal'
  },
  {
    _id: '103',
    title: 'Shoes',
    color: 'white'
  }
];

export const MOCK_CLOTHES = [
  // --- SHIRTS (Category 101) ---
  {
    _id: '301',
    categoryId: '101',
    title: 'Minimalist White Shirt',
    brand: 'LesChic',
    size: 'L',
    type: 'Top',
    imagePath: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    _id: '303',
    categoryId: '101',
    title: 'Black Premium Tee',
    brand: 'Essential',
    size: 'M',
    type: 'Top',
    imagePath: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    _id: '304',
    categoryId: '101',
    title: 'Navy Linen Shirt',
    brand: 'Coastal',
    size: 'L',
    type: 'Top',
    imagePath: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    _id: '310',
    categoryId: '101',
    title: 'Olive Oversized Tee',
    brand: 'Urban Layer',
    size: 'L',
    type: 'Top',
    imagePath: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    _id: '311',
    categoryId: '101',
    title: 'Charcoal Polo Shirt',
    brand: 'Tailor & Co',
    size: 'M',
    type: 'Top',
    imagePath: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=600&h=900&q=80'
  },

  // --- PANTS (Category 102) ---
  {
    _id: '305',
    categoryId: '102',
    title: 'Dark Wash Denim',
    brand: 'Raw Indigo',
    size: '32',
    type: 'Bottom',
    imagePath: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    _id: '306',
    categoryId: '102',
    title: 'Tan Slim Chinos',
    brand: 'UrbanStep',
    size: '34',
    type: 'Bottom',
    imagePath: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    _id: '307',
    categoryId: '102',
    title: 'Charcoal Dress Slacks',
    brand: 'Tailor & Co',
    size: '32',
    type: 'Bottom',
    imagePath: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    _id: '312',
    categoryId: '102',
    title: 'Black Cargo Pants',
    brand: 'Street Logic',
    size: '32',
    type: 'Bottom',
    imagePath: 'https://images.unsplash.com/photo-1517423738875-5ce310acd3da?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    _id: '313',
    categoryId: '102',
    title: 'Light Gray Sweatpants',
    brand: 'Essential',
    size: 'S',
    type: 'Bottom',
    imagePath: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=600&h=900&q=80'
  },

  // --- SHOES (Category 103) ---
  {
    _id: '302',
    categoryId: '103',
    title: 'Classic White Sneakers',
    brand: 'UrbanStep',
    size: '10',
    type: 'Shoes',
    imagePath: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    _id: '308',
    categoryId: '103',
    title: 'Retro Runner Shoes',
    brand: 'Vitesse',
    size: '10.5',
    type: 'Shoes',
    imagePath: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    _id: '309',
    categoryId: '103',
    title: 'Tan Chelsea Boots',
    brand: 'Heritage',
    size: '9',
    type: 'Shoes',
    imagePath: 'https://images.unsplash.com/photo-1608629601270-a0007becead3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    _id: '314',
    categoryId: '103',
    title: 'Leather Heels',
    brand: 'Heritage',
    size: '11',
    type: 'Shoes',
    imagePath: 'https://plus.unsplash.com/premium_photo-1671718111684-9142a70a5fe0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym9vdHN8ZW58MHx8MHx8fDA%3D'
  },
  {
    _id: '315',
    categoryId: '103',
    title: 'Black Athletic Trainer',
    brand: 'Vitesse',
    size: '10',
    type: 'Shoes',
    imagePath: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&h=900&q=80'
  }
];