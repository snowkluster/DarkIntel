#!/usr/bin/env python3

from fastapi import FastAPI, Query
from pydantic import BaseModel
from bs4 import BeautifulSoup as bs
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PostData(BaseModel):
    post_title: str
    post_link: str
    replies: str
    views: str
    date_posted: str

def extract_data_from_page(page):
    response_data = []
    html_content = page.content()
    soup = bs(html_content, 'html.parser')
    table_rows = soup.select('table.tborder tr')
    for row in table_rows[2:]:
        columns = row.find_all('td')
        if len(columns) >= 6:
            post_link = columns[2].find('a')['href']
            post_url = f"https://onniforums.com/{post_link}"
            post_title = columns[2].find('a').text
            replies = columns[5].text.strip()
            views = columns[6].text.strip()
            date_posted = row.select_one('td:nth-child(8)').get_text(strip=True)
            post_data = {
                "post_title": post_title,
                "post_link": post_url,
                "replies": replies,
                "views": views,
                "date_posted": date_posted
            }
            response_data.append(post_data)
    return response_data

@app.get("/search/")
def get_forum_posts(search_term: str = Query(...)):
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=True, slow_mo=1000)
        context = browser.new_context()
        context.add_cookies(json.loads(Path("cookies.json").read_text()))
        page = context.new_page()
        page.goto("https://onniforums.com/index.php")
        page.fill('fieldset#search input', search_term)
        page.click('fieldset#search input[type="submit"]')
        response_data = []

        while True:
            response_data.extend(extract_data_from_page(page))
            next_page_link = page.query_selector('a.pagination_next')
            if next_page_link:
                page.click('a.pagination_next')
                page.wait_for_load_state('networkidle')
            else:
                break

        browser.close()

    return response_data