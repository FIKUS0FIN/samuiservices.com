import re

with open('src/components/features/ServiceFilter.tsx', 'r') as f:
    content = f.read()

# We need to change the Category[] type to include children and modify the Accordion rendering.
new_interface = """interface CategoryWithChildren extends Category {
  children: Category[];
}

interface ServiceFilterProps {
  categories: CategoryWithChildren[];
}"""

content = re.sub(r'interface ServiceFilterProps \{[^}]+\}', new_interface, content)

# Modify the Categories Accordion logic
categories_accordion = """      {/* Dynamic Categories Accordion */}
      {categories.filter(cat => cat.parentId === null).map(parent => (
        <div key={parent.id} className="mb-6 border-b border-outline-muted/50 pb-6">
          <button
            onClick={() => toggleSection(parent.slug as any)}
            className="flex justify-between items-center w-full bg-transparent border-none p-0 cursor-pointer text-left"
          >
            <h3 className="text-label-sm font-bold uppercase tracking-wider text-text-main m-0">{parent.name}</h3>
            {openSections[parent.slug as keyof typeof openSections] !== false ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
          </button>

          {openSections[parent.slug as keyof typeof openSections] !== false && (
            <div className="flex flex-col gap-3 mt-4">
              {parent.children.map(child => {
                const isActive = activeCategory === child.slug;
                return (
                  <label key={child.id} className="flex items-center gap-3 cursor-pointer text-body-sm text-text-muted hover:text-text-main transition-colors">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => handleSelect(child.slug)}
                      className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary/30 cursor-pointer"
                    />
                    {child.name}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}"""

# Replace the existing hardcoded Categories Accordion with the dynamic one
content = re.sub(r'      \{\/\* Categories Accordion \*\/\}.*?(?=      \{\/\* Location Accordion \*\/})', categories_accordion + "\n\n", content, flags=re.DOTALL)

with open('src/components/features/ServiceFilter.tsx', 'w') as f:
    f.write(content)
