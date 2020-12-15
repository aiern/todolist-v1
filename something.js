db.products.insertOne({
  _id: 2,
  name: "Pencil",
  price: 0.80,
  stock: 12,
  review: [
    {
      authorName: "Amos",
      rating: 4,
      review: "Fantasti"
    },
    {
      authorName: "Jane",
      rating: 5,
      review: "The best pencil for drawing"
    }
  ]
})