//! WebAssembly bindings for Rust browser engine
//! Allows React frontend to communicate with Rust backend

use wasm-bindgen::prelude::*;
use rust_browser::Browser;
use rust_browser::EngineType;

#[wasm-bindgen]
pub struct WasmBrowser {
    browser: Browser,
}

#[wasm-bindgen]
impl WasmBrowser {
    #[wasm-bindgen(constructor)]
    pub fn new(engine_type: String) -> WasmBrowser {
        let engine = if engine_type == "servo" {
            EngineType::Servo
        } else {
            EngineType::WebKit
        };
        
        WasmBrowser {
            browser: Browser::new(engine),
        }
    }

    #[wasm-bindgen]
    pub fn create_tab(&self, url: Option<String>) -> String {
        self.browser.create_tab(url)
    }

    #[wasm-bindgen]
    pub fn close_tab(&self, tab_id: &str) {
        self.browser.close_tab(tab_id);
    }

    #[wasm-bindgen]
    pub async fn navigate(&self, tab_id: &str, url: String) -> Result<(), JsValue> {
        self.browser
            .navigate(tab_id, url)
            .await
            .map_err(|e| JsValue::from_str(&e))
    }

    #[wasm-bindgen]
    pub fn active_tab(&self) -> Option<String> {
        self.browser.active_tab()
    }

    #[wasm_bindgen]
    pub fn get_tab_info(&self, tab_id: &str) -> JsValue {
        if let Some(info) = self.browser.get_tab(tab_id) {
            serde_wasm_bindgen::to_value(&info).unwrap_or(JsValue::NULL)
        } else {
            JsValue::NULL
        }
    }
}

