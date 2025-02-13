


def track_active_window():
    current_window = None

    while True:
        # קבל את החלון הפעיל
        active_window = gw.getActiveWindow()
        if active_window:
            # אם החלון השתנה, הדפס את השם של החלון החדש
            if active_window != current_window:
                current_window = active_window
                print(f'חלון פעיל השתנה ל: {current_window.title}')
          # עיכוב של שנייה בין כל בדיקה


# הפעל את פונקציית המעקב
track_active_window()
