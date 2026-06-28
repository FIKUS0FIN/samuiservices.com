import re

with open('src/components/features/ServiceFilter.tsx', 'r') as f:
    content = f.read()

# Replace tailwind classes with inline styles or existing globals.css variables
content = content.replace('className="w-full pr-4 bg-surface-card rounded-card p-6 shadow-level-1"', 'style={{ width: "100%", paddingRight: "1rem" }}')
content = content.replace('className="mb-6 border-b border-outline-muted/50 pb-6"', 'style={{ marginBottom: "2rem" }}')
content = content.replace('className="flex justify-between items-center w-full bg-transparent border-none p-0 cursor-pointer text-left"', 'style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}')
content = content.replace('className="text-label-sm font-bold uppercase tracking-wider text-text-main m-0"', 'style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f172a", margin: 0 }}')
content = content.replace('className="w-4 h-4 text-outline"', 'size={16} color="#94a3b8"')
content = content.replace('className="flex flex-col gap-3 mt-4"', 'style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "1rem" }}')
content = content.replace('className="flex items-center gap-3 cursor-pointer text-body-sm text-text-muted hover:text-text-main transition-colors"', 'style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontSize: "0.9rem", color: "#334155" }}')
content = content.replace('className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary/30 cursor-pointer"', 'style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#06b6d4", borderRadius: "4px" }}')

# Fix static accordions
content = content.replace('className="flex flex-col gap-3 mt-4 text-body-sm text-text-muted"', 'style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "1rem", fontSize: "0.9rem", color: "#334155" }}')
content = content.replace('className="flex items-center gap-3 cursor-pointer hover:text-text-main transition-colors"', 'style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}')
content = content.replace('className="text-accent"', 'style={{ color: "#facc15" }}')
content = content.replace('className="ml-auto text-outline text-xs"', 'style={{ marginLeft: "auto", color: "#94a3b8", fontSize: "0.8rem" }}')
content = content.replace('className="text-outline-muted"', 'style={{ color: "#cbd5e1" }}')

content = content.replace('className="mb-2"', 'style={{ marginBottom: "2rem" }}')
content = content.replace('className="flex items-center h-6 mt-4"', 'style={{ display: "flex", alignItems: "center", height: "24px", marginTop: "1rem" }}')
content = content.replace('className="w-3 h-3 rounded-full border-2 border-outline bg-surface-card z-10 cursor-pointer hover:border-primary transition-colors"', 'style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid #cbd5e1", background: "white", zIndex: 2 }}')
content = content.replace('className="flex-1 h-1.5 bg-primary -mx-1 z-0"', 'style={{ flex: 1, height: "4px", background: "#06b6d4", margin: "0 -2px", zIndex: 1 }}')


with open('src/components/features/ServiceFilter.tsx', 'w') as f:
    f.write(content)
