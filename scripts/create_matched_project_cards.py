import os
from PIL import Image, ImageDraw, ImageFont

assets_dir = "/Users/arjhun_03/Documents/project/portfolio_new/assets/thumbnails"

def draw_card(filename, title_text, icon_type):
    # Standard size matching uploaded images ~ 600x800 or 400x533
    W, H = 400, 533
    img = Image.new("RGB", (W, H), color="#0d0e10")
    draw = ImageDraw.Draw(img)

    # Fonts
    try:
        font_sub = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 13)
        font_title = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue-Bold.otf", 32)
        font_tag = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 14)
        font_btn = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue-Medium.otf", 14)
        font_3d = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue-Bold.otf", 24)
    except:
        font_sub = font_title = font_tag = font_btn = font_3d = ImageFont.load_default()

    # "FEATURED PROJECT ----"
    draw.text((25, 30), "FEATURED PROJECT", fill="#ff6b00", font=font_sub)
    draw.line([(180, 37), (230, 37)], fill="#ff6b00", width=2)

    # Big Title
    lines = title_text.split("\n")
    y_pos = 70
    for line in lines:
        draw.text((25, y_pos), line, fill="#ff6b00", font=font_title)
        y_pos += 38

    # "Interactive • Innovative • Impactful"
    draw.text((25, y_pos + 15), "Interactive  •  Innovative  •  Impactful", fill="#9ca3af", font=font_tag)

    # "View Project ->" button
    btn_y = y_pos + 50
    draw.rectangle([25, btn_y, 160, btn_y + 36], outline="#ff6b00", width=1, fill="#131518")
    draw.text((42, btn_y + 9), "View Project  →", fill="#ff6b00", font=font_btn)

    # 3D Artwork Container Circle Glow at bottom
    center_x, center_y = W // 2 + 20, H - 130
    draw.ellipse([center_x - 120, center_y - 120, center_x + 120, center_y + 120], fill="#14161a")
    
    # 3D Object Box/Ring Representation
    if icon_type == "math":
        # Fraction Math Object
        draw.ellipse([center_x - 70, center_y - 70, center_x + 70, center_y + 70], fill="#1e2128", outline="#ff6b00", width=2)
        draw.text((center_x - 35, center_y - 30), "¾  >  ½", fill="#ff6b00", font=font_title)
        draw.text((center_x - 45, center_y + 10), "[ SOLVER ]", fill="#ffffff", font=font_sub)
    else:
        # Data Management System
        draw.rectangle([center_x - 75, center_y - 65, center_x + 75, center_y + 65], fill="#1e2128", outline="#333845", width=2)
        draw.rectangle([center_x - 65, center_y - 55, center_x + 65, center_y - 15], fill="#252932", outline="#ff6b00", width=1)
        draw.text((center_x - 45, center_y - 45), "DB :: CRUD", fill="#ff6b00", font=font_btn)
        draw.rectangle([center_x - 65, center_y, center_x + 65, center_y + 45], fill="#191b22")
        draw.text((center_x - 50, center_y + 15), "CI4 SYSTEM", fill="#ffffff", font=font_sub)

    outpath = os.path.join(assets_dir, filename)
    img.save(outpath, "PNG")
    print(f"Saved {outpath}")

draw_card("fractionsolver_user.png", "Fraction\nOrder Solver", "math")
draw_card("datamanagement_user.png", "Data\nManagement", "db")
