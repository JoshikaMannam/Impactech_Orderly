import requests
from bs4 import BeautifulSoup

def fetch_top_10_movies():
    url = "https://www.imdb.com/chart/top/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, 'html.parser')
    movies = []

    # The specific selector may change if IMDB layout changes in the future
    table = soup.find('table', class_='chart')
    if not table:
        print("Could not find the 'chart' table in IMDB HTML.")
        return []

    rows = table.find_all('tr')[1:11]  # Exclude header row

    for row in rows:
        title_column = row.find('td', class_='titleColumn')
        rating_column = row.find('td', class_='imdbRating')

        if title_column and rating_column and title_column.a and rating_column.strong:
            title = title_column.a.text.strip()
            year = title_column.span.text.strip('()')
            imdb_link = 'https://www.imdb.com' + title_column.a['href'].split('?')[0]
            rating = rating_column.strong.text.strip()

            movies.append({
                'title': title,
                'year': year,
                'rating': rating,
                'imdb_link': imdb_link
            })
        else:
            # Sometimes IMDB includes ad/trailer rows without proper columns, so skip
            continue

    print(f"Number of movies scraped: {len(movies)}")
    return movies
