from services.ai_service import get_recommendations_ai

async def get_recommendations(items: list, db) -> list:
    if not items:
        return []

    # items from order_items use 'item_name' column
    item_names = [
        i.get("item_name") or i.get("name", "")
        for i in items
        if i.get("item_name") or i.get("name")
    ]
    if not item_names:
        return []

    cursor = db.cursor(dictionary=True)
    cursor.execute(
        """SELECT name, category FROM menu_items
           WHERE is_available = 1
           ORDER BY category, name"""
    )
    menu = cursor.fetchall()
    cursor.close()

    menu_list = ", ".join(
        [f"{m['name']} ({m['category']})" for m in menu]
    )
    return await get_recommendations_ai(item_names, menu_list)