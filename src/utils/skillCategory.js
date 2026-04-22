/** @typedef {'backend'|'frontend'|'devops'|'data'|'mobile'|'cloud'|'qa'|'general'} SkillCategoryId */

/** Ordered for legend (meaningful groups first). */
export const SKILL_LEGEND_ORDER = [
  "backend",
  "frontend",
  "devops",
  "cloud",
  "data",
  "mobile",
  "qa",
  "general",
];

export const SKILL_CATEGORY_META = {
  backend: { label: "Backend & APIs", short: "Backend" },
  frontend: { label: "Frontend & UI", short: "Frontend" },
  devops: { label: "DevOps & CI/CD", short: "DevOps" },
  cloud: { label: "Cloud platforms", short: "Cloud" },
  data: { label: "Data & ML", short: "Data / ML" },
  mobile: { label: "Mobile", short: "Mobile" },
  qa: { label: "QA & testing", short: "QA" },
  general: { label: "Other", short: "Other" },
};

const KEYWORD_ENTRIES = [];

function addCategory(keywords, id) {
  for (const kw of keywords) {
    KEYWORD_ENTRIES.push({ kw: kw.toLowerCase(), id });
  }
}

addCategory(
  [
    "react native",
    "react-native",
    "flutter",
    "swift",
    "kotlin",
    "android",
    "ios",
    "xamarin",
    "objective-c",
    "objectivec",
  ],
  "mobile",
);

addCategory(
  [
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "scikit learn",
    "sklearn",
    "pandas",
    "numpy",
    "keras",
    "natural language",
    "computer vision",
    "data science",
    "data engineering",
    "snowflake",
    "databricks",
    "apache spark",
    "apache hadoop",
    "power bi",
    "matplotlib",
    "seaborn",
    "bigquery",
    "redshift",
    "nlp",
    "llm",
    "generative ai",
    "neural",
    "etl",
    "hadoop",
    "spark",
    "tableau",
    "looker",
    "dbt",
  ],
  "data",
);

addCategory(
  [
    "selenium",
    "cypress",
    "playwright",
    "testcafe",
    "quality assurance",
    "qa engineer",
    "qa automation",
    "load testing",
    "performance testing",
    "junit",
    "testng",
    "mocha",
    "chai",
    "enzyme",
  ],
  "qa",
);

addCategory(
  [
    "kubernetes",
    "k8s",
    "docker",
    "terraform",
    "ansible",
    "jenkins",
    "github actions",
    "gitlab ci",
    "ci/cd",
    "argo cd",
    "argocd",
    "helm",
    "prometheus",
    "grafana",
    "nginx",
    "devops",
    "infrastructure as code",
    "iac",
    "puppet",
    "chef",
    "vault",
    "istio",
    "linkerd",
  ],
  "devops",
);

addCategory(
  [
    "amazon web services",
    "google cloud",
    "microsoft azure",
    "firebase",
    "cloudformation",
    "cloudwatch",
    "route53",
    "dynamodb",
    "lambda",
    "api gateway",
    "ecs",
    "eks",
    "fargate",
    "s3 bucket",
    "azure devops",
    "gcp",
    "aws",
    "azure",
    "ec2",
    "s3",
    "sqs",
    "sns",
    "cloudfront",
  ],
  "cloud",
);

addCategory(
  [
    "typescript",
    "javascript",
    "html5",
    "html",
    "css3",
    "css",
    "sass",
    "scss",
    "less",
    "tailwind",
    "bootstrap",
    "material-ui",
    "material ui",
    "chakra",
    "styled-components",
    "styled components",
    "emotion",
    "redux",
    "webpack",
    "vite",
    "babel",
    "eslint",
    "prettier",
    "jest",
    "storybook",
    "jquery",
    "ember",
    "nuxt",
    "gatsby",
    "next.js",
    "nextjs",
    "svelte",
    "angular",
    "vue.js",
    "vuejs",
    "vue",
    "react",
    "front-end",
    "frontend",
    "rxjs",
  ],
  "frontend",
);

addCategory(
  [
    "spring boot",
    "spring framework",
    "spring",
    "django",
    "flask",
    "fastapi",
    "ruby on rails",
    "express.js",
    "expressjs",
    "nestjs",
    "nest.js",
    "node.js",
    "nodejs",
    "laravel",
    "symfony",
    "asp.net",
    "asp.net core",
    ".net core",
    "entity framework",
    "hibernate",
    "microservices",
    "microservice",
    "rabbitmq",
    "grpc",
    "graphql",
    "rest api",
    "postgresql",
    "postgres",
    "mysql",
    "mariadb",
    "mongodb",
    "redis",
    "memcached",
    "kafka",
    "elasticsearch",
    "solr",
    "c#",
    "csharp",
    "java",
    "ruby",
    "rails",
    "php",
    "golang",
    "rust",
    "elixir",
    "phoenix",
    "clojure",
    "scala",
    "akka",
    "backend",
    "api",
    "prisma",
    "sequelize",
    "typeorm",
    "mongoose",
    "sqlalchemy",
    "celery",
    "sidekiq",
    "node",
    "python",
  ],
  "backend",
);

KEYWORD_ENTRIES.sort((a, b) => b.kw.length - a.kw.length);

/**
 * @param {string} skill
 * @returns {SkillCategoryId}
 */
export function getSkillCategory(skill) {
  if (typeof skill !== "string" || !skill.trim()) return "general";
  const s = skill.toLowerCase();
  for (const { kw, id } of KEYWORD_ENTRIES) {
    if (s.includes(kw)) return id;
  }
  return "general";
}
