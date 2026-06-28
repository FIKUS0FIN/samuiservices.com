import re

# Fix src/app/actions/seed.ts again
with open('src/app/actions/seed.ts', 'r') as f:
    content = f.read()

# I am going to replace "as any" with "as unknown" or remove it if possible. Let me just replace the remaining "as any".
content = content.replace("as any", "as unknown")
with open('src/app/actions/seed.ts', 'w') as f:
    f.write(content)

# Fix src/app/not-found.tsx
with open('src/app/not-found.tsx', 'r') as f:
    content = f.read()
content = content.replace("couldn't", "couldn&apos;t")
with open('src/app/not-found.tsx', 'w') as f:
    f.write(content)
