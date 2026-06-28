import re

with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

replacement = """model Category {
  id       String     @id @default(cuid())
  name     String
  slug     String     @unique
  icon     String
  parentId String?
  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")
  listings Listing[]
}"""

content = re.sub(r'model Category \{[^}]+\}', replacement, content)

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)
