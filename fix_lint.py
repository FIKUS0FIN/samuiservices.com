import re

# Fix seed.ts
with open('prisma/seed.ts', 'r') as f:
    content = f.read()
content = content.replace("import { faker } from '@faker-js/faker'", "")
content = content.replace("const createdParents: Record<string, any> = {}", "const createdParents: Record<string, { id: string }> = {}")
with open('prisma/seed.ts', 'w') as f:
    f.write(content)

# Fix src/app/actions/seed.ts
with open('src/app/actions/seed.ts', 'r') as f:
    content = f.read()
content = re.sub(r'catch \(error: any\)', 'catch (error: unknown)', content)
content = re.sub(r'error\.message', '(error as Error).message', content)
content = re.sub(r"const err = error as any;", "const err = error as Error;", content)
with open('src/app/actions/seed.ts', 'w') as f:
    f.write(content)

# Fix src/app/page.tsx
with open('src/app/page.tsx', 'r') as f:
    content = f.read()
content = content.replace("RESULTS FOR \"{categories.find(c => c.slug === categorySlug)?.name?.toUpperCase()}\"", "RESULTS FOR &quot;{categories.find(c => c.slug === categorySlug)?.name?.toUpperCase()}&quot;")
content = content.replace("We couldn't find any services matching this category yet.", "We couldn&apos;t find any services matching this category yet.")
content = content.replace("import { getAllCategories, getBusinessesByIsland, getAllIslands } from '@/lib/db';", "import { getAllCategories, getBusinessesByIsland } from '@/lib/db';")
with open('src/app/page.tsx', 'w') as f:
    f.write(content)

# Fix src/components/features/ServiceFilter.tsx
with open('src/components/features/ServiceFilter.tsx', 'r') as f:
    content = f.read()
content = content.replace("toggleSection(parent.slug as any)", "toggleSection(parent.slug as keyof typeof openSections)")
with open('src/components/features/ServiceFilter.tsx', 'w') as f:
    f.write(content)
