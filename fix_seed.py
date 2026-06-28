import re

with open('prisma/seed.ts', 'r') as f:
    content = f.read()

content = content.replace('const createdParents = {}', 'const createdParents: Record<string, any> = {}')

with open('prisma/seed.ts', 'w') as f:
    f.write(content)
