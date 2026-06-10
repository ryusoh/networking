import sys
import time
from playwright.sync_api import sync_playwright
from rich.console import Console
from rich.panel import Panel

console = Console()

def main():
    console.print(Panel.fit("Xiaohongshu Vibe Relogin Tool", style="bold magenta"))

    # Persistent user data directory
    user_data_dir = "./xhs_browser_state"

    with sync_playwright() as p:
        console.print("[cyan]Launching browser...[/cyan]")
        browser = p.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=False,
            viewport={'width': 1280, 'height': 800}
        )
        
        page = browser.pages[0] if browser.pages else browser.new_page()
        
        console.print("[cyan]Navigating to Xiaohongshu...[/cyan]")
        page.goto("https://www.xiaohongshu.com/")
        
        console.print("[yellow]Checking login state...[/yellow]")
        
        try:
            # Check if web_session cookie exists
            cookies = browser.cookies("https://www.xiaohongshu.com")
            web_session = next((c for c in cookies if c['name'] == 'web_session'), None)
            
            is_logged_in = web_session is not None
            
            if not is_logged_in:
                console.print("[bold red]Not logged in! Please scan the QR code in the opened browser window.[/bold red]")
                console.print("[cyan]Waiting for successful login...[/cyan]")
                
                # Wait until web_session cookie is acquired
                while not is_logged_in:
                    time.sleep(2)
                    cookies = browser.cookies("https://www.xiaohongshu.com")
                    web_session = next((c for c in cookies if c['name'] == 'web_session'), None)
                    if web_session:
                        is_logged_in = True

            console.print("[bold green]✅ Login successful! Cookie saved.[/bold green]")
            console.print(f"[dim]web_session: {web_session['value'][:15]}...[/dim]")
            
        except Exception as e:
            console.print(f"[bold red]Error during flow: {e}[/bold red]")
            
        finally:
            console.print("[cyan]Closing browser elegantly...[/cyan]")
            time.sleep(1) # small pause to ensure state flushes
            browser.close()

if __name__ == "__main__":
    main()
