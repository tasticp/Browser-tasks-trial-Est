//! Build script for cross-platform compilation

fn main() {
    // Platform-specific build configurations
    
    #[cfg(target_os = "android")]
    {
        println!("cargo:rustc-link-lib=android");
    }

    #[cfg(target_os = "ios")]
    {
        println!("cargo:rustc-link-lib=framework=UIKit");
        println!("cargo:rustc-link-lib=framework=WebKit");
    }

    #[cfg(target_os = "macos")]
    {
        println!("cargo:rustc-link-lib=framework=WebKit");
        println!("cargo:rustc-link-lib=framework=Cocoa");
    }

    #[cfg(target_os = "windows")]
    {
        println!("cargo:rustc-link-lib=ole32");
        println!("cargo:rustc-link-lib=oleaut32");
    }

    #[cfg(target_os = "linux")]
    {
        println!("cargo:rustc-link-lib=webkit2gtk-4.1");
    }
}

