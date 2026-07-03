# Tech Detection Reference

Map dependencies from package.json / pyproject.toml / requirements.txt to display names.

## JavaScript/TypeScript (package.json)

### Frontend Frameworks
| Dependency | Display Name |
|------------|-------------|
| `next` | Next.js |
| `react` | React.js |
| `react-dom` | React.js |
| `vue`, `nuxt` | Vue.js / Nuxt |
| `svelte`, `sveltekit` | Svelte / SvelteKit |
| `angular` | Angular |
| `gatsby` | Gatsby |

### Languages & Runtime
| Dependency | Display Name |
|------------|-------------|
| `typescript` | TypeScript |
| `javascript` | JavaScript |
| `node` | Node.js |

### Styling
| Dependency | Display Name |
|------------|-------------|
| `tailwindcss` | Tailwind CSS |
| `styled-components` | Styled Components |
| `@emotion/react` | Emotion |
| `sass`, `node-sass` | SASS |

### Databases & ORM
| Dependency | Display Name |
|------------|-------------|
| `@prisma/client`, `prisma` | Prisma ORM |
| `drizzle-orm` | Drizzle ORM |
| `typeorm` | TypeORM |
| `sequelize` | Sequelize |
| `mongoose` | Mongoose |
| `@neondatabase/serverless` | Neon Postgres |
| `pg` | PostgreSQL |
| `better-sqlite3` | SQLite |

### Auth
| Dependency | Display Name |
|------------|-------------|
| `@clerk/nextjs` | Clerk |
| `next-auth` | NextAuth.js |
| `better-auth` | BetterAuth |
| `@supabase/supabase-js` | Supabase |

### AI & APIs
| Dependency | Display Name |
|------------|-------------|
| `openai` | OpenAI API |
| `@google/generative-ai` | Gemini AI |
| `langchain` | LangChain |
| `ai` (Vercel) | Vercel AI SDK |
| `stripe` | Stripe |

### CMS
| Dependency | Display Name |
|------------|-------------|
| `sanity` | Sanity CMS |
| `@contentful/contentful-contentful` | Contentful |
| `@strapi/strapi` | Strapi |

### E-commerce
| Dependency | Display Name |
|------------|-------------|
| `shopify` | Shopify |
| `woocommerce` | WooCommerce |

## Python (pyproject.toml / requirements.txt)

### Frameworks
| Dependency | Display Name |
|------------|-------------|
| `fastapi` | FastAPI |
| `django` | Django |
| `flask` | Flask |
| `streamlit` | Streamlit |

### AI/ML
| Dependency | Display Name |
|------------|-------------|
| `openai` | OpenAI API |
| `langchain` | LangChain |
| `transformers` | Hugging Face |
| `torch`, `pytorch` | PyTorch |
| `tensorflow` | TensorFlow |
| `pandas` | Pandas |
| `numpy` | NumPy |

### AI Agents
| Dependency | Display Name |
|------------|-------------|
| `openai-agents` | OpenAI Agents SDK |
| `chainlit` | Chainlit |
| `autogen` | AutoGen |
| `crewai` | CrewAI |

### Databases
| Dependency | Display Name |
|------------|-------------|
| `sqlalchemy` | SQLAlchemy |
| `psycopg2` | PostgreSQL |
| `redis` | Redis |
| `qdrant-client` | Qdrant |
| `pymongo` | MongoDB |

### Web Scraping
| Dependency | Display Name |
|------------|-------------|
| `beautifulsoup4` | BeautifulSoup |
| `scrapy` | Scrapy |
| `selenium` | Selenium |
| `playwright` | Playwright |

## Detection Script

```bash
# For Node.js projects
gh api repos/OWNER/REPO/contents/package.json --jq '.content' | base64 -d | \
  node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); \
  const p=JSON.parse(d); \
  const deps=Object.keys({...p.dependencies,...p.devDependencies}); \
  console.log(deps.join(','))"

# For Python projects
gh api repos/OWNER/REPO/contents/pyproject.toml --jq '.content' | base64 -d | \
  grep -E 'dependencies|requires' -A 50 | head -30
```

## Language Detection

| Extension | Language |
|-----------|----------|
| `.js`, `.jsx` | JavaScript |
| `.ts`, `.tsx` | TypeScript |
| `.py` | Python |
| `.rb` | Ruby |
| `.go` | Go |
| `.rs` | Rust |
| `.java` | Java |
| `.php` | PHP |
| `.liquid` | Liquid (Shopify) |
