import re

with open('src/lib/db.ts', 'r') as f:
    content = f.read()

replacement = """export async function getAllCategories() {
  return prisma.category.findMany({
    include: {
      children: true
    }
  });
}"""

content = re.sub(r'export async function getAllCategories\(\) \{[^}]+\}', replacement, content)

with open('src/lib/db.ts', 'w') as f:
    f.write(content)
