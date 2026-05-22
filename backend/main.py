from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.products import router as product_router
from routes.cart import router as cart_router

app = FastAPI()

# to connect react frontend to this backend 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# auth, product and cart routes
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(product_router, prefix="/products", tags=["products"])
app.include_router(cart_router, prefix="/cart", tags=["cart"])

@app.get("/")
def root():
    return {"message": "Backend is running"}