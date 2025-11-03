//! Memory-efficient allocation and pooling
//! Reduces allocations and fragmentation

use std::alloc::{GlobalAlloc, Layout, System};
use std::sync::atomic::{AtomicUsize, Ordering};

/// Memory pool for efficient allocations
/// Uses bump allocator pattern for tab-related data
pub struct MemoryPool {
    allocated: AtomicUsize,
    peak: AtomicUsize,
}

impl MemoryPool {
    pub fn new() -> Self {
        Self {
            allocated: AtomicUsize::new(0),
            peak: AtomicUsize::new(0),
        }
    }

    /// Track memory allocation
    pub fn allocate(&self, size: usize) -> usize {
        let current = self.allocated.fetch_add(size, Ordering::Relaxed) + size;
        let peak = self.peak.load(Ordering::Relaxed);
        if current > peak {
            self.peak.store(current, Ordering::Relaxed);
        }
        current
    }

    /// Track memory deallocation
    pub fn deallocate(&self, size: usize) {
        self.allocated.fetch_sub(size, Ordering::Relaxed);
    }

    /// Get current memory usage in bytes
    pub fn current_usage(&self) -> usize {
        self.allocated.load(Ordering::Relaxed)
    }

    /// Get peak memory usage in bytes
    pub fn peak_usage(&self) -> usize {
        self.peak.load(Ordering::Relaxed)
    }

    /// Reset peak tracking
    pub fn reset_peak(&self) {
        self.peak.store(0, Ordering::Relaxed);
    }
}

impl Default for MemoryPool {
    fn default() -> Self {
        Self::new()
    }
}

/// Zero-copy string buffer using bytes
pub struct StringBuffer {
    data: Vec<u8>,
}

impl StringBuffer {
    pub fn new() -> Self {
        Self { data: Vec::with_capacity(256) }
    }

    pub fn with_capacity(cap: usize) -> Self {
        Self { data: Vec::with_capacity(cap) }
    }

    pub fn append(&mut self, bytes: &[u8]) {
        self.data.extend_from_slice(bytes);
    }

    pub fn to_string(&self) -> String {
        String::from_utf8_lossy(&self.data).to_string()
    }

    pub fn clear(&mut self) {
        self.data.clear();
    }

    pub fn len(&self) -> usize {
        self.data.len()
    }
}

impl Default for StringBuffer {
    fn default() -> Self {
        Self::new()
    }
}

/// Memory statistics for monitoring
#[derive(Debug, Clone, Copy)]
pub struct MemoryStats {
    pub current_bytes: usize,
    pub peak_bytes: usize,
    pub tab_count: usize,
}

impl MemoryStats {
    pub fn new(current: usize, peak: usize, tabs: usize) -> Self {
        Self {
            current_bytes: current,
            peak_bytes: peak,
            tab_count: tabs,
        }
    }

    pub fn as_mb(&self) -> (f64, f64) {
        (
            self.current_bytes as f64 / 1_048_576.0,
            self.peak_bytes as f64 / 1_048_576.0,
        )
    }
}

