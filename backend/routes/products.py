from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import db
from models import Product, ProductUpdate

router = APIRouter()

# crud operations 

# converts mongodb's ids to string for json response 
def product_serialiser(product) -> dict: 
    return {
        "id": str(product["_id"]),
        "name": product["name"],
        "description": product["description"],
        "price": product["price"],
        "category": product["category"],
        "image_url": product["image_url"],
        "stock": product["stock"]
    }

# adds a new product 
@router.post("/")
async def create_product(product: Product): 
    new_product = product.dict()
    result = await db.products.insert_one(new_product)
    created = await db.products.find_one({"_id": result.inserted_id})
    return product_serialiser(created)

# gets all products + optional live search by name or category  
@router.get("/")
async def get_products(search: str = ""):
    # if search query is provided, filters by name or category (case insensitive)
    # powers live search bar on frontend 
    query = {}
    if search:
        query = {
            "$or": [
                {"name": {"$regex": search, "$options": "i"}},
                {"category": {"$regex": search, "$options": "i"}}
            ]
        }
    products = await db.products.find(query).to_list(100)
    return [product_serialiser(p) for p in products]

# gets single product by id 
@router.get("/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_serialiser(product)

# edits an existing product by id 
@router.put("/{product_id}")
async def update_product(product_id: str, updates: ProductUpdate):
    # only updates fields that were actually provided
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated = await db.products.find_one({"_id": ObjectId(product_id)})
    return product_serialiser(updated)

# deletes product by id 
@router.delete("/{product_id}")
async def delete_product(product_id: str):
    result = await db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}