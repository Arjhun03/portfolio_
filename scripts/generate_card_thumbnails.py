import os
from PIL import Image, ImageDraw, ImageFont

# Directory setup
assets_dir = "/Users/arjhun_03/Documents/project/portfolio_new/assets/thumbnails"
os.makedirs(assets_dir, exist_ok=True)

# Common dimensions & theme palette from reference image:
# Dark Charcoal/Slate background (#16181d), glowing subtle border, vibrant orange accents (#ff6b00)
WIDTH, HEIGHT = 600, 360

projects = [
    {
        "filename": "codebreaker.png",
        "title": "CODE BREAKER",
        "subtitle": "PASSWORD DIGIT GUESSER",
        "badge": "JS GAME",
        "icon": "[ 9 4 8 2 ]",
        "accent": "#ff6b00"
    },
    {
        "filename": "cyberquiz.png",
        "title": "CYBERPUNK QUIZ",
        "subtitle": "NEON INTERACTIVE QUIZ APP",
        "badge": "QUIZ UI",
        "icon": "?  A / B / C",
        "accent": "#ff6b00"
    },
    {
        "filename": "ecommerce.png",
        "title": "E-COMMERCE STORE",
        "subtitle": "PRODUCT & CART CHECKOUT",
        "badge": "STOREFRONT",
        "icon": "[ CART | $99 ]",
        "accent": "#ff6b00"
    },
    {
        "filename": "flames.png",
        "title": "FLAMES GAME",
        "subtitle": "RELATIONSHIP STATUS CALCULATOR",
        "badge": "MINI GAME",
        "icon": "< FLAMES >",
        "accent": "#ff6b00"
    },
    {
        "filename": "fractionsolver.png",
        "title": "FRACTION SOLVER",
        "subtitle": "MATH ORDER & COMPARISON TOOL",
        "badge": "MATH JS",
        "icon": "3/4 > 1/2 > 1/4",
        "accent": "#ff6b00"
    },
    {
        "filename": "datamanagement.png",
        "title": "DATA MANAGEMENT",
        "subtitle": "CODEIGNITER 4 CRUD SYSTEM",
        "badge": "CI4 BACKEND",
        "icon": "DB :: CRUD :: SYSTEM",
        "accent": "#ff6b00"
    },
    {
        "filename": "eldorado_new.png",
        "title": "EL DORADO CASINO",
        "subtitle": "WEBRTC MULTIPLAYER PLATFORM",
        "badge": "REACT 19 + PEERJS",
        "icon": "[ MULTIPLAYER | WEBRTC ]",
        "accent": "#ff6b00"
    },
    {
        "filename": "gameboy_new.png",
        "title": "AJU'S 3D GAMEBOY",
        "subtitle": "INTERACTIVE WEBGL 3D PORTFOLIO",
        "badge": "THREE.JS + GLTF",
        "icon": "< 3D GAMEBOY ARCADE >",
        "accent": "#ff6b00"
    }
]

def create_card_image(proj):
    img = Image.new("RGB", (WIDTH, HEIGHT), color="#16181d")
    draw = ImageDraw.Draw(img)

    # Outer subtle rounded container outline
    draw.rectangle([10, 10, WIDTH-10, HEIGHT-10], outline="#232730", width=2)
    
    # Header bar
    draw.rectangle([10, 10, WIDTH-10, 50], fill="#1c1f26")
    
    # Top left mini dots
    draw.ellipse([25, 26, 33, 34], fill="#ff5f56")
    draw.ellipse([40, 26, 48, 34], fill="#ffbd2e")
    draw.ellipse([55, 26, 63, 34], fill="#27c93f")

    # Top right badge
    draw.rectangle([WIDTH-150, 18, WIDTH-25, 42], fill="#242832", outline="#333845", width=1)
    
    # Main Inner Display Box
    draw.rectangle([40, 75, WIDTH-40, HEIGHT-40], fill="#121418", outline="#252932", width=1)

    # Accent glow strip
    draw.rectangle([40, 75, WIDTH-40, 78], fill=proj["accent"])

    # Load system font
    try:
        font_lg = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 26)
        font_sm = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 13)
        font_md = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 16)
        font_badge = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 11)
    except:
        font_lg = font_sm = font_md = font_badge = ImageFont.load_default()

    # Draw Badge text
    draw.text((WIDTH-135, 23), proj["badge"], fill=proj["accent"], font=font_badge)

    # Draw Center Visual Element / Icon Representation
    draw.text((65, 120), proj["icon"], fill=proj["accent"], font=font_lg)
    
    # Draw Title
    draw.text((65, 195), proj["title"], fill="#ffffff", font=font_lg)
    
    # Draw Subtitle
    draw.text((65, 235), proj["subtitle"], fill="#8e96a4", font=font_md)

    # Bottom status indicator
    draw.ellipse([65, 280, 73, 288], fill=proj["accent"])
    draw.text((82, 277), "LIVE APPLICATION PREVIEW", fill="#6b7280", font=font_sm)

    filepath = os.path.join(assets_dir, proj["filename"])
    img.save(filepath, "PNG")
    print(f"Saved {filepath}")

for p in projects:
    create_card_image(p)

print("All card images created successfully.")
