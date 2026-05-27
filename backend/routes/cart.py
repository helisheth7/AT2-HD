from fastapi import APIRouter, HTTPException, Header
from bson import ObjectId
from database import db
from models import CartItem, CartItemUpdate
from auth import decode_token

router = APIRouter()

# crud operations for cart 

# extracts and decodes the JWT token from the authorisation header then token is 
# sent as "Bearer <token>" so it's split and second part can be taken
def get_user_from_token(authorization: str):
    try:
        token = authorization.split(" ")[1]
        payload = decode_token(token)
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# adds a product to the user's cart
@router.post("/")
async def add_to_cart(item: CartItem, authorization: str = Header(...)):
    user = get_user_from_token(authorization)
    user_id = user["sub"]

    # checks if product actually exists before adding to cart
    product = await db.products.find_one({"_id": ObjectId(item.product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # if product already in cart, increases quantity
    existing = await db.cart.find_one({
        "user_id": user_id,
        "product_id": item.product_id
    })
    if existing:
        await db.cart.update_one(
            {"_id": existing["_id"]},
            {"$inc": {"quantity": item.quantity}}
        )
        return {"message": "Cart updated"}

    # otherwise adds it as a new cart item
    cart_item = {
        "user_id": user_id,
        "product_id": item.product_id,
        "quantity": item.quantity
    }
    await db.cart.insert_one(cart_item)
    return {"message": "Item added to cart"}

# gets the logged in user's cart with product details
@router.get("/")
async def get_cart(authorization: str = Header(...)):
    user = get_user_from_token(authorization)
    user_id = user["sub"]

    # fetches full product details for each cart item
    cart_items = await db.cart.find({"user_id": user_id}).to_list(100)
    result = []
    for item in cart_items:
        product = await db.products.find_one({"_id": ObjectId(item["product_id"])})
        if product:
            result.append({
                "cart_item_id": str(item["_id"]),
                "product_id": item["product_id"],
                "name": product["name"],
                "price": product["price"],
                "image_url": product["image_url"],
                "quantity": item["quantity"],
                "subtotal": product["price"] * item["quantity"]
            })
    return result

# updates the quantity of a cart item
@router.put("/{cart_item_id}")
async def update_cart_item(
    cart_item_id: str,
    update: CartItemUpdate,
    authorization: str = Header(...)
):
    user = get_user_from_token(authorization)

    # confirms the cart item belongs to this user
    cart_item = await db.cart.find_one({"_id": ObjectId(cart_item_id)})
    if not cart_item or cart_item["user_id"] != user["sub"]:
        raise HTTPException(status_code=404, detail="Cart item not found")

    await db.cart.update_one(
        {"_id": ObjectId(cart_item_id)},
        {"$set": {"quantity": update.quantity}}
    )
    return {"message": "Quantity updated"}

# removes item from the cart
@router.delete("/{cart_item_id}")
async def remove_from_cart(cart_item_id: str, authorization: str = Header(...)):
    user = get_user_from_token(authorization)

    # make sure the cart item belongs to this user before deleting
    cart_item = await db.cart.find_one({"_id": ObjectId(cart_item_id)})
    if not cart_item or cart_item["user_id"] != user["sub"]:
        raise HTTPException(status_code=404, detail="Cart item not found")

    await db.cart.delete_one({"_id": ObjectId(cart_item_id)})
    return {"message": "Item removed from cart"}

# admin - view all users' carts with their details
@router.get("/admin/all")
async def get_all_carts(authorization: str = Header(...)):
    user = get_user_from_token(authorization)

    # makes it so only admins can access this route
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admins only")

    # fetch user and product details for each cart item
    cart_items = await db.cart.find().to_list(1000)
    result = []
    for item in cart_items:
        db_user = await db.users.find_one({"_id": ObjectId(item["user_id"])})
        product = await db.products.find_one({"_id": ObjectId(item["product_id"])})
        if db_user and product:
            result.append({
                "username": db_user.get("username", "Unknown"),
                "email": db_user.get("email", "Unknown"),
                "product_name": product["name"],
                "product_price": product["price"],
                "quantity": item["quantity"],
                "subtotal": product["price"] * item["quantity"]
            })
    return result