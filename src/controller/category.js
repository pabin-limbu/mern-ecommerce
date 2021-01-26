const slugify = require("slugify");
const Category = require("../models/category");

//function
function createCategories(categories, parentId = null) {
  //recursive function to stack children category under parent category.
  const categoryList = [];
  let category;
  /** AS the parent category will not have parent id so all category without parent id will be filtered and fetched from all categries.
   *cycle through eact parent category--> while checking a children category we call this function again but send current parent id and all categories in arguement.
   this time it has parent id to compare and if matched with all categories list push sub category iside parent category and do this until parent id dont match with any category.
   --> when no match is found the for loop jumps to new parent category and check for its child category as before. 
   */

  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
    // console.log(category);
    // console.log(categories.length, "parent");
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
    //console.log(categories.length,"child");
    //console.log(category);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.addCategory = (req, res) => {
  const categoryObj = { name: req.body.name, slug: slugify(req.body.name) };
  //extract if file type exist like image.
  if (req.file) {
    categoryObj.categoryImage =
      process.env.API + "/public/" + req.file.filename;
  }

  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  const cat = new Category(categoryObj);
  cat.save((error, category) => {
    if (error) {
      return res.status(400).json({ error });
    }

    if (category) {
      return res.status(201).json({ category });
    }
  });
};

exports.getCategories = (req, res) => {
  Category.find({}).exec((error, categories) => {
    if (error) {
      return res.status(400).json({ error });
    }

    if (categories) {
      const categoryList = createCategories(categories); //to create a category-->subcategory.

      return res.status(200).json({ categoryList });
    }
  });
};
