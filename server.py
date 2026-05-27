import http.server
import socketserver
import json
import os
import re
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

PORT = 8080
DB_FILE = 'images/db.json'
UPLOAD_DIR = 'images'

# Ensure upload directory exists
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Default data to populate db.json if it doesn't exist
DEFAULT_DB = {
    "menuData": {
        "breakfast": [
            {
                "name": "Breakfast Combo",
                "price": "$6.99",
                "desc": "2 eggs, 2 pancakes, and your choice of bacon, ham, or sausage. Available Monday–Friday, all day. The best deal in Chicago!",
                "img": "images/breakfast-combo.png",
                "tags": ["best value", "mon–fri"]
            },
            {
                "name": "Chicago Breakfast",
                "price": "$9.99",
                "desc": "2 eggs, your choice of meat (ham, bacon, or sausage patty), 1 sausage link, crispy hash browns, and 1 fluffy pancake. A Chicago classic.",
                "img": "images/chicago-breakfast.png",
                "tags": ["popular"]
            },
            {
                "name": "Special",
                "price": "$10.99",
                "desc": "2 eggs, 2 sausage links, golden hash browns, toast, and a hot cup of coffee. Everything you need to start the day right.",
                "img": "images/eggs-breakfast.png",
                "tags": ["includes coffee"]
            },
            {
                "name": "Country Fried Steak & 2 Eggs",
                "price": "$11.99",
                "desc": "Crispy country fried steak smothered in creamy white gravy, served with 2 eggs any style, hash browns, and toast.",
                "img": "images/country-fried-steak.png",
                "tags": ["hearty"]
            },
            {
                "name": "Tribune French Toast",
                "price": "$12.99",
                "desc": "Thick-cut brioche dipped in our secret cinnamon batter, griddled to golden perfection. Dusted with powdered sugar and served with fresh berries.",
                "img": "images/french-toast.png",
                "tags": ["popular"]
            },
            {
                "name": "King of the Hill Omelette",
                "price": "$13.99",
                "desc": "The ultimate omelette — loaded with ham, bacon, sausage, onion, peppers, potatoes, and melted cheddar cheese. Not for the faint of heart!",
                "img": "images/omelette.png",
                "tags": ["popular"]
            },
            {
                "name": "Triple Threat",
                "price": "$14.00",
                "desc": "2 eggs any style, 2 strips of bacon, 2 sausage links, crispy hash browns, and toast. Triple the meat, triple the satisfaction.",
                "img": "images/breakfast-combo.png",
                "tags": ["hearty"]
            },
            {
                "name": "Corned Beef Hash & Eggs",
                "price": "$14.99",
                "desc": "Our legendary homemade corned beef hash — crispy outside, tender inside. Featured on Chicago's Best. Served with 2 eggs any style and toast.",
                "img": "images/corned-beef-hash.png",
                "tags": ["popular", "featured on tv"]
            },
            {
                "name": "Buttermilk Pancakes",
                "price": "$9.99",
                "desc": "A tall stack of fluffy buttermilk pancakes served with real butter and warm maple syrup. The fluffiest in Chicago — add them to any breakfast!",
                "img": "images/pancakes.png",
                "tags": ["classic"]
            }
        ],
        "lunch": [
            {
                "name": "Chicken Sandwich",
                "price": "$10.49",
                "desc": "Grilled chicken sandwich served with a cup of soup, golden fries, and a soft drink. A complete lunch at a great price.",
                "img": "images/chicken-sandwich.png",
                "tags": ["lunch special"]
            },
            {
                "name": "Chicken Melt",
                "price": "$10.49",
                "desc": "Grilled chicken with avocado, crispy bacon, melted Swiss cheese, lettuce, and tomato on toasted multi-grain bread. Includes soup, fries, and a soft drink.",
                "img": "images/chicken-melt.png",
                "tags": ["lunch special"]
            },
            {
                "name": "Small Julienne Salad",
                "price": "$10.49",
                "desc": "Fresh julienne salad with strips of turkey, ham, Swiss cheese, hard-boiled egg, tomato, and crisp lettuce. Includes soup, fries, and a soft drink.",
                "img": "images/julienne-salad.png",
                "tags": ["lunch special"]
            },
            {
                "name": "Chicken Wrap",
                "price": "$10.49",
                "desc": "Grilled chicken, crispy bacon, cheddar cheese, lettuce, tomato, and ranch dressing wrapped in a flour tortilla. Includes soup, fries, and a soft drink.",
                "img": "images/chicken-wrap.png",
                "tags": ["lunch special"]
            },
            {
                "name": "Corned Beef Sandwich",
                "price": "$14.99",
                "desc": "Piled high with our house-made corned beef on your choice of bread. The same legendary corned beef featured on Chicago's Best.",
                "img": "images/corned-beef-hash.png",
                "tags": ["popular"]
            },
            {
                "name": "Jr. Club Sandwich",
                "price": "$11.99",
                "desc": "A classic club sandwich with turkey, bacon, lettuce, tomato, and mayo on toasted bread. Served with fries or coleslaw.",
                "img": "images/chicken-sandwich.png",
                "tags": []
            }
        ],
        "dinners": [
            {
                "name": "Meatloaf Dinner",
                "price": "Market Price",
                "desc": "Homestyle meatloaf with rich brown gravy, served with creamy mashed potatoes and seasonal vegetables. Made fresh daily. Available Monday–Friday.",
                "img": "images/meatloaf-dinner.png",
                "tags": ["mon–fri", "homemade"]
            },
            {
                "name": "Hot Turkey Dinner",
                "price": "Market Price",
                "desc": "Hand-carved fresh turkey breast (prepared daily by Angelo) with mashed potatoes, homemade gravy, and seasonal vegetables. Available Monday–Friday.",
                "img": "images/meatloaf-dinner.png",
                "tags": ["mon–fri", "made fresh daily"]
            },
            {
                "name": "Chicken Breast Dinner",
                "price": "Market Price",
                "desc": "Golden-seared chicken breast served with creamy mashed potatoes, gravy, and steamed vegetables. A hearty comfort classic. Available Monday–Friday.",
                "img": "images/chicken-wrap.png",
                "tags": ["mon–fri"]
            },
            {
                "name": "Pork Chops",
                "price": "$14.99",
                "desc": "Two tender grilled pork chops served with creamy mashed potatoes and sautéed green beans. Angelo's recipe, perfected over decades.",
                "img": "images/pork-chops.png",
                "tags": ["chef's pick"]
            }
        ],
        "drinks": [
            {
                "name": "Bottomless Coffee",
                "price": "$2.99",
                "desc": "Hot, fresh-brewed coffee that never runs dry. The backbone of every great breakfast. Refills always free.",
                "img": "images/coffee.png",
                "tags": ["popular"]
            },
            {
                "name": "Fresh Orange Juice",
                "price": "$3.99",
                "desc": "Freshly squeezed orange juice — bright, sweet, and the perfect way to start your morning.",
                "img": "images/coffee.png",
                "tags": []
            },
            {
                "name": "Soft Drink",
                "price": "$2.49",
                "desc": "Choice of Coca-Cola, Diet Coke, Sprite, or other fountain beverages. Included free with all lunch specials.",
                "img": "images/coffee.png",
                "tags": []
            },
            {
                "name": "Hot Chocolate",
                "price": "$3.49",
                "desc": "Rich, creamy hot chocolate topped with whipped cream. A cozy treat on cold Chicago mornings.",
                "img": "images/coffee.png",
                "tags": []
            },
            {
                "name": "Iced Tea",
                "price": "$2.49",
                "desc": "Refreshing house-brewed iced tea. Sweetened or unsweetened, your choice.",
                "img": "images/coffee.png",
                "tags": []
            },
            {
                "name": "Milkshake",
                "price": "$5.99",
                "desc": "Thick, old-fashioned milkshake in chocolate, vanilla, or strawberry. Made with real ice cream.",
                "img": "images/coffee.png",
                "tags": ["classic"]
            },
            {
                "name": "Hot Tea",
                "price": "$2.49",
                "desc": "Selection of herbal and classic teas. Ask your server for available flavors.",
                "img": "images/coffee.png",
                "tags": []
            }
        ]
    },
    "galleryData": [
        { "src": "images/french-toast.png", "caption": "Tribune French Toast", "category": "food" },
        { "src": "images/coffee.png", "caption": "Morning Coffee", "category": "food" },
        { "src": "images/hero.png", "caption": "The Dining Room", "category": "vibe" },
        { "src": "images/pancakes.png", "caption": "Buttermilk Pancakes", "category": "food" },
        { "src": "images/corned-beef-hash.png", "caption": "Famous Corned Beef Hash", "category": "food" },
        { "src": "images/owner.png", "caption": "Chef Angelo at Work", "category": "people" },
        { "src": "images/pork-chops.png", "caption": "Grilled Pork Chops", "category": "food" },
        { "src": "images/eggs-breakfast.png", "caption": "Classic Breakfast", "category": "food" },
        { "src": "images/breakfast-combo.png", "caption": "Breakfast Combo", "category": "food" },
        { "src": "images/chicken-sandwich.png", "caption": "Chicken Sandwich Lunch Special", "category": "food" },
        { "src": "images/chicken-melt.png", "caption": "Chicken Melt", "category": "food" },
        { "src": "images/country-fried-steak.png", "caption": "Country Fried Steak & Eggs", "category": "food" },
        { "src": "images/omelette.png", "caption": "King of the Hill Omelette", "category": "food" },
        { "src": "images/meatloaf-dinner.png", "caption": "Homestyle Meatloaf Dinner", "category": "food" },
        { "src": "images/chicken-wrap.png", "caption": "Chicken Wrap", "category": "food" },
        { "src": "images/julienne-salad.png", "caption": "Julienne Salad", "category": "food" },
        { "src": "images/chicago-breakfast.png", "caption": "The Chicago Breakfast", "category": "food" }
    ],
    "reviewsData": [
        {
            "id": "rev_default_1",
            "name": "Steven Piotrowski",
            "initials": "SP",
            "rating": 5,
            "date": "3 months ago",
            "text": "My favorite spot in Chicago to grab breakfast with friendly and familiar faces. Angelo, the owner and operator, treats patrons like neighbors and is always accommodating. The prices are very reasonable and the homemade quality and effort shows in every dish. Can't recommend this place enough!",
            "badge": "Local Guide",
            "bg": "bg-1",
            "response": "Thank you, Steven. This review made our day."
        },
        {
            "id": "rev_default_2",
            "name": "Dude Knows",
            "initials": "DK",
            "rating": 5,
            "date": "7 months ago",
            "text": "**CASH ONLY** Classic breakfast joint known for their corned beef. They were featured on Chicago's Best for this. The corned beef was very tasty and the jelly for the toast was great. Very friendly and speedy service. Highly recommend for breakfast lovers.",
            "badge": "Local Guide",
            "bg": "bg-2",
            "response": "Thank you so much for the kind words. I am new at this, hope to see you again. I really appreciate your review."
        },
        {
            "id": "rev_default_3",
            "name": "Richard Friedman",
            "initials": "RF",
            "rating": 5,
            "date": "3 months ago",
            "text": "Yellow Rose is a civic treasure. The owner/chef Angelo is a culinary genius. Every day he makes fresh turkey and ham. His pork chops, hot beef and corned beef hash are incredible. If you're eating breakfast you must add pancakes to your order — they are the fluffiest in Chicago!",
            "badge": "Local Guide",
            "bg": "bg-3",
            "response": "Thank you, Richard for the nice comments. I really appreciate it."
        },
        {
            "id": "rev_default_4",
            "name": "Michael K.",
            "initials": "MK",
            "rating": 5,
            "date": "2 weeks ago",
            "text": "A true Chicago classic. The Tribune French Toast is unbelievable, but honestly, it's the atmosphere that keeps me coming back. It feels like stepping into a warmer, friendlier era without feeling forced. Cash only, so hit the ATM first!",
            "badge": "Local Guide",
            "bg": "bg-1",
            "response": None
        },
        {
            "id": "rev_default_5",
            "name": "Sarah L.",
            "initials": "SL",
            "rating": 4.5,
            "date": "1 month ago",
            "text": "The corned beef hash is made in-house and you can taste the difference. Great service, very attentive even when it was packed on a Sunday morning. Love the wooden booths and old-school vibe. Will definitely be back!",
            "badge": None,
            "bg": "bg-2",
            "response": None
        }
    ],
    "pendingReviews": [],
    "pendingGallery": [],
    "siteSettings": {
        "logoText": "Yellow Rose Cafe",
        "phone": "(773) 631-2397",
        "address": "5640 N Elston Ave, Chicago, IL 60646",
        "hours": "Monday – Sunday: 6:00 AM – 2:00 PM",
        "payment": "Cash Only",
        "heroTitle": "Chicago's Favorite Breakfast Spot",
        "heroSubtitle": "Homemade classics, friendly faces, and the best corned beef hash in the city. Serving our neighborhood with love since 1954.",
        "heroBg": "images/hero.png",
        "aboutTitle": "From Our Kitchen to Your Table",
        "aboutSubtitle": "A Chicago institution for 70 years — where every guest is a neighbor.",
        "aboutHeading": "Meet Angelo",
        "aboutContent": "At Yellow Rose Cafe, we believe the best meals are served with a side of conversation and a lot of heart.\n\nWhat started as a dream to create a true neighborhood gathering spot has grown into a cornerstone of our Elston Avenue community. Our owner and chef, Angelo, has always operated with one simple philosophy: treat every guest like a neighbor, and every meal like a home-cooked Sunday feast.",
        "aboutQuote": "Whether you're catching up with old friends, starting your workday, or stopping by for one of our signature daily specials, Angelo and our team are here to make sure you feel right at home.",
        "aboutImage": "images/owner.png",
        "aboutStatYear": "1954",
        "aboutStatRating": "4.7★",
        "aboutStatCount": "555+"
    },
    "promotions": {
        "topBannerActive": True,
        "topBannerText": "Cash Only · Serving Chicago Since 1954"
    },
    "customSections": [],
    "subscribers": [],
    "emailLogs": [],
    "smtpSettings": {
        "host": "",
        "port": 587,
        "username": "",
        "password": "",
        "fromEmail": "",
        "useTls": True
    },
    "analytics": {
        "totalVisits": 1420,
        "interactions": 384,
        "pageViews": {
            "home": 850,
            "menu": 420,
            "gallery": 180,
            "about": 110,
            "reviews": 160
        },
        "clicks": {
            "call": 48,
            "directions": 92,
            "subscribe": 24,
            "review_submit": 12
        }
    },
    "activityLogs": []
}

def load_db():
    if not os.path.exists(DB_FILE):
        # Fallback to local root db.json if it exists (useful for first-time migration)
        if os.path.exists('db.json'):
            try:
                with open('db.json', 'r', encoding='utf-8') as f:
                    data = json.load(f)
                save_db(data)
                return data
            except Exception as e:
                pass
        save_db(DEFAULT_DB)
        return DEFAULT_DB
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading DB, reverting to default: {e}")
        return DEFAULT_DB

def save_db(data):
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def send_real_email(smtp_config, to_email, subject, html_content, text_content=""):
    host = smtp_config.get('host')
    port = smtp_config.get('port')
    user = smtp_config.get('username')
    password = smtp_config.get('password')
    from_email = smtp_config.get('fromEmail')

    if not host or not user or not password or not from_email:
        raise ValueError("SMTP Server not configured. Please set credentials in Admin Panel Settings.")

    try:
        port = int(port)
    except ValueError:
        port = 587

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f"Yellow Rose Cafe <{from_email}>"
    msg['To'] = to_email

    # Add body parts
    part1 = MIMEText(text_content, 'plain')
    part2 = MIMEText(html_content, 'html')
    msg.attach(part1)
    msg.attach(part2)

    # Establish SMTP connection
    if port == 465:
        server = smtplib.SMTP_SSL(host, port, timeout=10)
    else:
        server = smtplib.SMTP(host, port, timeout=10)
        server.ehlo()
        if smtp_config.get('useTls', True):
            server.starttls()
            server.ehlo()

    server.login(user, password)
    server.sendmail(from_email, to_email, msg.as_string())
    server.quit()

def parse_multipart(headers, rfile):
    """
    Sleek custom multipart/form-data parser for compatibility with Python 3.13+
    (Avoids dependency on deprecated cgi module)
    """
    content_type = headers.get('Content-Type', '')
    if 'multipart/form-data' not in content_type:
        return None, "Not a multipart request"
        
    try:
        boundary = content_type.split("boundary=")[1].strip()
    except IndexError:
        return None, "Boundary delimiter not found in Content-Type header"
        
    boundary_bytes = ("--" + boundary).encode('utf-8')
    content_length = int(headers.get('Content-Length', 0))
    if content_length == 0:
        return None, "Request body is empty"
        
    body = rfile.read(content_length)
    parts = body.split(boundary_bytes)
    
    for part in parts:
        if not part or part == b'--\r\n' or part == b'--\r\n\r\n' or part == b'--':
            continue
            
        # Split headers and body content
        header_end = part.find(b'\r\n\r\n')
        if header_end == -1:
            continue
            
        part_headers = part[:header_end].decode('utf-8', errors='ignore')
        part_body = part[header_end+4:]
        
        # Clean boundary delimiters from body ending
        if part_body.endswith(b'\r\n'):
            part_body = part_body[:-2]
            
        # Find file field
        if 'name="file"' in part_headers:
            filename_match = re.search(r'filename="([^"]+)"', part_headers)
            if filename_match:
                filename = filename_match.group(1)
                return {
                    "filename": filename,
                    "content": part_body
                }, None
                
    return None, "File input field ('file') not detected in form"

class CMSHandler(http.server.SimpleHTTPRequestHandler):
    
    def log_message(self, format, *args):
        # Prevent analytics requests from flooding the console logs
        if args and isinstance(args[0], str) and ("analytics" in args[0] or "db" in args[0]):
            return
        super().log_message(format, *args)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # Prevent direct downloading of the database file
        if 'db.json' in self.path.lower():
            self.send_response(403)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": "Access forbidden"}).encode('utf-8'))
            return

        if self.path == '/api/db':
            db_data = load_db()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.end_headers()
            self.wfile.write(json.dumps(db_data).encode('utf-8'))
            return
        
        super().do_GET()

    def do_POST(self):
        # 1. Update Database Config
        if self.path == '/api/db':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                new_data = json.loads(post_data.decode('utf-8'))
                save_db(new_data)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Database saved"}).encode('utf-8'))
            except Exception as e:
                self.send_error_response(500, f"Failed to save database: {str(e)}")
            return

        # 2. Add Subscriber and Trigger Real Email
        elif self.path == '/api/subscribe':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                req_data = json.loads(post_data.decode('utf-8'))
                email = req_data.get('email', '').strip()
                
                if not email:
                    self.send_error_response(400, "Email address is required")
                    return
                
                db = load_db()
                is_existing = any(sub['email'].lower() == email.lower() for sub in db['subscribers'])
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                
                welcome_subject = "Welcome to the Yellow Rose Cafe Family! 🌹"
                welcome_html = f"""
                <html>
                <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; color: #212529;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e9ecef; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <div style="background: #e63946; padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 28px;">Yellow Rose Cafe</h1>
                            <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Serving Chicago Since 1954</p>
                        </div>
                        <div style="padding: 30px; line-height: 1.6;">
                            <h2 style="color: #1d3557; margin-top: 0;">Hey there!</h2>
                            <p>Thank you for subscribing to our Daily Specials list! You are now part of our inner circle on Elston Avenue.</p>
                            <p>Here is a little welcome gift from Chef Angelo to start your day right:</p>
                            
                            <div style="background: #f1faee; border-left: 4px solid #e63946; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
                                <h3 style="margin: 0; color: #e63946;">WELCOME10</h3>
                                <p style="margin: 5px 0 0; font-size: 14px; color: #457b9d;">Show this code on your next visit to receive <strong>10% OFF</strong> or a <strong>FREE Coffee</strong>!</p>
                            </div>
                            
                            <p>We make fresh turkey, ham, and our famous corned beef hash daily. We can't wait to see you pull up a chair!</p>
                            <hr style="border: 0; border-top: 1px solid #e9ecef; margin: 25px 0;">
                            <p style="font-size: 13px; color: #6c757d;"><strong>Location:</strong> 5640 N Elston Ave, Chicago, IL<br><strong>Phone:</strong> (773) 631-2397<br><em>*Reminder: We are Cash Only!*</em></p>
                        </div>
                        <div style="background: #f8f9fa; text-align: center; padding: 15px; font-size: 12px; color: #6c757d; border-top: 1px solid #e9ecef;">
                            © {datetime.now().year} Yellow Rose Cafe. All rights reserved.
                        </div>
                    </div>
                </body>
                </html>
                """
                welcome_text = "Welcome to the Yellow Rose Cafe Family! Use code WELCOME10 for 10% OFF or a FREE Coffee on your next visit. We are located at 5640 N Elston Ave, Chicago, IL. (Cash Only!)"

                # Send Email
                email_sent = False
                email_status = "Pending Setup"
                error_msg = ""
                
                smtp_config = db.get('smtpSettings', {})
                if smtp_config.get('host') and smtp_config.get('username'):
                    try:
                        send_real_email(smtp_config, email, welcome_subject, welcome_html, welcome_text)
                        email_sent = True
                        email_status = "Sent Successfully"
                    except Exception as mail_err:
                        error_msg = str(mail_err)
                        email_status = f"SMTP Error: {error_msg[:60]}..."
                else:
                    email_status = "Logged (SMTP Config Missing)"

                # Save Subscriber
                if not is_existing:
                    db['subscribers'].append({
                        "email": email,
                        "date": timestamp,
                        "status": "Active"
                    })
                    
                # Log activity log
                ip = self.client_address[0]
                ip_label = "Local Client" if ip in ("127.0.0.1", "::1") else ip
                if 'activityLogs' not in db:
                    db['activityLogs'] = []
                db['activityLogs'].insert(0, {
                    "ip": ip,
                    "text": f"New user subscribed to newsletter: {email} (from {ip_label})",
                    "time": timestamp,
                    "interactive": True
                })
                db['activityLogs'] = db['activityLogs'][:100]
                
                # Log email send status
                db['emailLogs'].insert(0, {
                    "id": str(uuid.uuid4())[:8],
                    "email": email,
                    "subject": welcome_subject,
                    "date": timestamp,
                    "status": email_status,
                    "details": error_msg if error_msg else "Welcome mail sent."
                })

                # Update Analytics
                db['analytics']['interactions'] += 1
                db['analytics']['clicks']['subscribe'] += 1
                
                save_db(db)

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "success", 
                    "email_sent": email_sent,
                    "email_status": email_status,
                    "error": error_msg
                }).encode('utf-8'))
            except Exception as e:
                self.send_error_response(500, f"Subscription processing failed: {str(e)}")
            return

        # 3. Send Manual Newsletter Draft to All Subscribers
        elif self.path == '/api/send-email':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                req_data = json.loads(post_data.decode('utf-8'))
                subject = req_data.get('subject', '').strip()
                body = req_data.get('body', '').strip()
                
                if not subject or not body:
                    self.send_error_response(400, "Subject and Body are required")
                    return
                
                db = load_db()
                smtp_config = db.get('smtpSettings', {})
                
                if not smtp_config.get('host') or not smtp_config.get('username'):
                    self.send_error_response(400, "SMTP server is not configured. Please complete SMTP setup in settings first.")
                    return
                
                subscribers = db.get('subscribers', [])
                if not subscribers:
                    self.send_error_response(400, "No subscribers to send to.")
                    return

                html_template = f"""
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 20px; color: #333333;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e4e4e7; overflow: hidden;">
                        <div style="background: #e63946; padding: 20px; text-align: center; color: white;">
                            <h2 style="margin: 0;">Yellow Rose Cafe</h2>
                            <p style="margin: 5px 0 0; font-size: 12px; opacity: 0.8;">Special Announcement</p>
                        </div>
                        <div style="padding: 25px; line-height: 1.6;">
                            {body.replace('\n', '<br>')}
                            <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 25px 0;">
                            <p style="font-size: 12px; color: #71717a; text-align: center;">
                                You are receiving this because you subscribed to updates from Yellow Rose Cafe.<br>
                                5640 N Elston Ave, Chicago, IL 60646 | (773) 631-2397
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """

                sent_count = 0
                failed_emails = []
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                for sub in subscribers:
                    email_addr = sub['email']
                    try:
                        send_real_email(smtp_config, email_addr, subject, html_template, body)
                        sent_count += 1
                        
                        db['emailLogs'].insert(0, {
                            "id": str(uuid.uuid4())[:8],
                            "email": email_addr,
                            "subject": subject,
                            "date": timestamp,
                            "status": "Sent Successfully",
                            "details": "Newsletter broadcast."
                        })
                    except Exception as err:
                        failed_emails.append(f"{email_addr}: {str(err)}")
                        db['emailLogs'].insert(0, {
                            "id": str(uuid.uuid4())[:8],
                            "email": email_addr,
                            "subject": subject,
                            "date": timestamp,
                            "status": "Failed",
                            "details": str(err)
                        })
                
                db['analytics']['interactions'] += sent_count
                save_db(db)

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "success",
                    "sent_count": sent_count,
                    "failed_count": len(failed_emails),
                    "failures": failed_emails
                }).encode('utf-8'))
            except Exception as e:
                self.send_error_response(500, f"Failed to broadcast newsletter: {str(e)}")
            return

        # 4. Handle Multipart Image File Uploads (Native custom parsing)
        elif self.path == '/api/upload':
            try:
                file_info, err = parse_multipart(self.headers, self.rfile)
                if err:
                    self.send_error_response(400, err)
                    return
                
                filename = file_info["filename"]
                part_body = file_info["content"]
                
                if not filename:
                    self.send_error_response(400, "Empty filename submitted")
                    return
                
                # Generate unique filename to prevent overwrites
                ext = os.path.splitext(filename)[1].lower()
                if ext not in ['.png', '.jpg', '.jpeg', '.gif', '.webp']:
                    self.send_error_response(400, "Invalid file type. Supported: png, jpg, jpeg, gif, webp")
                    return

                new_filename = f"uploaded_{uuid.uuid4().hex}{ext}"
                file_path = os.path.join(UPLOAD_DIR, new_filename)
                
                # Write file content
                with open(file_path, 'wb') as f:
                    f.write(part_body)
                
                img_url = f"images/{new_filename}"
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "success",
                    "url": img_url
                }).encode('utf-8'))

            except Exception as e:
                self.send_error_response(500, f"Upload error: {str(e)}")
            return

        # 5. Handle Analytics logging
        elif self.path == '/api/analytics':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                req_data = json.loads(post_data.decode('utf-8'))
                event_type = req_data.get('type')
                label = req_data.get('label')
                
                db = load_db()
                ip = self.client_address[0]
                ip_label = "Local Client" if ip in ("127.0.0.1", "::1") else ip
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                
                log_text = ""
                
                if event_type == 'view':
                    db['analytics']['totalVisits'] += 1
                    page = label.lower()
                    if page in db['analytics']['pageViews']:
                        db['analytics']['pageViews'][page] += 1
                    else:
                        db['analytics']['pageViews'][page] = 1
                    log_text = f"Visitor from {ip_label} viewed {label.capitalize()} page"
                    
                elif event_type == 'click':
                    db['analytics']['interactions'] += 1
                    btn = label.lower()
                    if btn in db['analytics']['clicks']:
                        db['analytics']['clicks'][btn] += 1
                    else:
                        db['analytics']['clicks'][btn] = 1
                    
                    if btn == 'call':
                        log_text = f"Visitor from {ip_label} clicked 'Call Cafe' phone link"
                    elif btn == 'directions':
                        log_text = f"Visitor from {ip_label} clicked 'Get Directions' map link"
                    elif btn == 'subscribe':
                        log_text = f"Visitor from {ip_label} subscribed to daily specials newsletter"
                    elif btn == 'review_submit':
                        log_text = f"Visitor from {ip_label} submitted a guest review for moderation"
                    elif btn == 'gallery_submit':
                        log_text = f"Visitor from {ip_label} uploaded a photo to gallery moderation"
                    elif btn == 'view_photo':
                        log_text = f"Visitor from {ip_label} viewed a gallery photo lightbox"
                    elif btn.startswith('menu_item_'):
                        item_name = btn[10:].replace('_', ' ').title()
                        log_text = f"Visitor from {ip_label} viewed menu details for {item_name}"
                    else:
                        log_text = f"Visitor from {ip_label} clicked '{btn.replace('_', ' ').capitalize()}'"
                
                elif event_type == 'admin':
                    log_text = f"Administrator: {label}"
                
                if log_text:
                    if 'activityLogs' not in db:
                        db['activityLogs'] = []
                    db['activityLogs'].insert(0, {
                        "ip": ip,
                        "text": log_text,
                        "time": timestamp,
                        "interactive": event_type in ('click', 'admin')
                    })
                    db['activityLogs'] = db['activityLogs'][:100] # Cap at last 100 entries
                
                save_db(db)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            except Exception as e:
                self.send_error_response(500, str(e))
            return

        self.send_error(404, "API endpoint not found")

    def send_error_response(self, code, message):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "error", "message": message}).encode('utf-8'))

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    allow_reuse_address = True
    daemon_threads = True

# Setup server
Handler = CMSHandler

with ThreadedHTTPServer(("", PORT), Handler) as httpd:
    print(f"==================================================")
    print(f" Yellow Rose Cafe Dynamic Backend Server Running")
    print(f" Port: {PORT}")
    print(f" URL:  http://localhost:{PORT}")
    print(f" Admin Panel: http://localhost:{PORT}/admin.html")
    print(f"==================================================")
    
    # Initialize DB file on startup
    load_db()
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()
