import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AssistantIcon from '@material-ui/icons/Assistant';
import DescriptionIcon from '@material-ui/icons/Description';
import ChatIcon from '@material-ui/icons/Chat';
import { TemplateCard } from '@backstage/plugin-scaffolder-react/alpha';
import type { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2, 3, 0),
    padding: 0,
    border: 0,
    borderRadius: 0,
    boxShadow: 'none',
    background: 'transparent',
  },
  embeddedRoot: {
    margin: theme.spacing(0, 0, 2),
    padding: 0,
    border: 0,
    borderRadius: 0,
    boxShadow: 'none',
    background: 'transparent',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
  },
  platformPalFrame: {
    padding: theme.spacing(2),
    borderRadius: 12,
    border: '1px solid #c9d6ea',
    background: 'linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)',
    boxShadow: '0 8px 20px rgba(31, 56, 97, 0.08)',
  },
  heading: {
    fontWeight: 700,
    letterSpacing: -0.2,
    fontSize: '1.375rem',
    lineHeight: 1.25,
  },
  subtitle: {
    marginBottom: theme.spacing(1.5),
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  chips: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
  },
  plan: {
    marginTop: theme.spacing(1),
    whiteSpace: 'pre-wrap',
  },
  templatesTitle: {
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
  },
  templatesLayout: {
    marginTop: theme.spacing(2.5),
    display: 'grid',
    gridTemplateColumns: '280px minmax(0, 1fr)',
    gap: theme.spacing(2),
    alignItems: 'start',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '220px minmax(0, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  imageRail: {
    border: '1px solid #d7dde5',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 360,
    },
  },
  railImage: {
    width: '100%',
    display: 'block',
    objectFit: 'cover',
  },
  templatesContent: {
    minWidth: 0,
  },
  registerSlot: {
    marginTop: theme.spacing(1.25),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
  },
  sectionTitle: {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  sectionContainer: {
    padding: theme.spacing(1.5),
    borderRadius: 8,
    border: '1px solid #b7d3b8',
    backgroundColor: '#e6f3e7',
    marginBottom: theme.spacing(2),
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: theme.spacing(1.25),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  webSectionContainer: {
    border: '1px solid #e6bf89',
    backgroundColor: '#fcefdc',
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'inline-block',
    backgroundColor: theme.palette.success.main,
  },
  webSectionDot: {
    backgroundColor: '#2e7d32',
  },
  templateCardWrap: {
    minWidth: 0,
    '& > *': {
      height: '100%',
    },
  },
}));

const REFERENCE_RAIL_IMAGE =
  'https://raw.githubusercontent.com/ahoglun2/UX-Abeer/main/Screenshot%202026-03-17%20at%2012.30.50.png';

const backendServiceTemplates = [
  {
    id: 'node-service',
    title: 'Node.js Service Starter',
    description: 'Production-ready REST service with docs, health checks, and CI defaults.',
    labels: ['template-service', 'cid-backstage'],
    owner: 'developer-experience',
    type: 'service',
  },
  {
    id: 'python-service',
    title: 'Python FastAPI Starter',
    description: 'FastAPI template with linting, testing, and observability baseline.',
    labels: ['python', 'backend'],
    owner: 'platform-team',
    type: 'service',
  },
  {
    id: 'worker-service',
    title: 'Background Worker Starter',
    description: 'Queue-based worker with retries, metrics, and operational runbook setup.',
    labels: ['worker', 'reliability'],
    owner: 'operations-team',
    type: 'service',
  },
];

const webApplicationTemplates = [
  {
    id: 'react-webapp',
    title: 'React Web App Starter',
    description: 'Frontend application with routing, testing, linting, and deploy pipeline defaults.',
    labels: ['frontend', 'react'],
    owner: 'web-platform',
    type: 'website',
  },
  {
    id: 'nextjs-webapp',
    title: 'Next.js Product App',
    description: 'SSR-ready product shell with auth guard, observability, and docs scaffolding.',
    labels: ['nextjs', 'product-ui'],
    owner: 'product-engineering',
    type: 'website',
  },
  {
    id: 'admin-portal',
    title: 'Internal Admin Portal',
    description: 'Admin-focused web UI with role-based access, audit logging hooks, and feature flags.',
    labels: ['admin', 'rbac'],
    owner: 'internal-tools',
    type: 'website',
  },
];

const toTemplateEntity = (template: {
  id: string;
  title: string;
  description: string;
  labels: string[];
  owner: string;
  type: string;
}): TemplateEntityV1beta3 => ({
  apiVersion: 'scaffolder.backstage.io/v1beta3',
  kind: 'Template',
  metadata: {
    name: template.id,
    title: template.title,
    description: template.description,
    tags: template.labels,
  },
  spec: {
    owner: template.owner,
    type: template.type,
    parameters: [],
    steps: [],
  },
});

const createServicePlan = (prompt: string) => {
  const normalized = prompt.toLowerCase();

  const stack = normalized.includes('python')
    ? 'Python + FastAPI'
    : normalized.includes('java')
      ? 'Java + Spring Boot'
      : normalized.includes('go')
        ? 'Go + Gin'
        : 'TypeScript + Node.js';

  const runtime = normalized.includes('serverless') ? 'Serverless runtime' : 'Kubernetes service';
  const apiStyle = normalized.includes('graphql') ? 'GraphQL API contract' : 'REST API contract';
  const priority = normalized.includes('internal') ? 'internal consumers' : 'external and internal consumers';

  return [
    `Recommended baseline: ${stack}, ${runtime}, ${apiStyle}.`,
    `Primary audience: ${priority}.`,
    'Next steps in this page:',
    '1. Pick a starter template that matches your stack.',
    '2. Add owner, repository details, and environment defaults.',
    '3. Enable docs, runbook, dashboards, and on-call metadata before create.',
  ].join('\n');
};

type CreateAssistantBannerProps = {
  embedded?: boolean;
};

export const CreateAssistantBanner = ({ embedded = false }: CreateAssistantBannerProps) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [submittedPrompt, setSubmittedPrompt] = useState('');

  const generatedPlan = useMemo(() => {
    if (!submittedPrompt) {
      return '';
    }

    return createServicePlan(submittedPrompt);
  }, [submittedPrompt]);

  return (
    <Paper
      className={embedded ? classes.embeddedRoot : classes.root}
      role="region"
      aria-label="Platform Pal service creation assistant"
    >
      <div className={classes.platformPalFrame}>
        <div className={classes.topRow}>
          <AssistantIcon color="primary" />
          <Typography variant="h4" className={classes.heading}>
            Platform Pal
          </Typography>
        </div>

        <Typography variant="subtitle1" color="textSecondary" className={classes.subtitle}>
          Describe the service you want to create and Platform Pal will suggest a fast setup plan.
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="What service do you want to build?"
          placeholder="Example: Internal payments reconciliation service in Python with GraphQL"
          value={prompt}
          onChange={event => setPrompt(event.target.value)}
          inputProps={{ 'aria-label': 'Platform Pal service prompt' }}
        />

        <div className={classes.chips}>
          <Chip label="Service scaffold" size="small" />
          <Chip label="Ownership" size="small" />
          <Chip label="Docs + runbook" size="small" />
        </div>

        <Box className={classes.actions}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setSubmittedPrompt(prompt.trim())}
            disabled={!prompt.trim()}
          >
            Get suggestion
          </Button>
        </Box>

        {generatedPlan ? (
          <Typography variant="body2" className={classes.plan}>
            {generatedPlan}
          </Typography>
        ) : null}
      </div>

      <div
        className={classes.registerSlot}
        data-platform-pal-register-slot="true"
        aria-label="Register Existing Component action placement"
      />

      <div className={classes.templatesLayout}>
        <div className={classes.imageRail}>
          <img
            src={REFERENCE_RAIL_IMAGE}
            alt="Reference for template card layout"
            className={classes.railImage}
          />
        </div>

        <div className={classes.templatesContent}>
          <Typography variant="subtitle1" className={classes.templatesTitle}>
            Templates
          </Typography>

          <Typography variant="subtitle2" className={classes.sectionTitle}>
            <span className={classes.sectionDot} aria-hidden="true" />
            Backend Service
          </Typography>
          <div className={classes.sectionContainer}>
            <div className={classes.cardsGrid}>
              {backendServiceTemplates.map(template => (
                <div key={template.id} className={classes.templateCardWrap}>
                  <TemplateCard
                    template={toTemplateEntity(template)}
                    additionalLinks={[
                      { icon: DescriptionIcon, text: 'View TechDocs', url: '#' },
                      { icon: ChatIcon, text: 'Slack channel', url: '#' },
                    ]}
                    onSelected={selected => navigate(`/create/templates/default/${selected.metadata.name}`)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Typography variant="subtitle2" className={classes.sectionTitle}>
            <span className={`${classes.sectionDot} ${classes.webSectionDot}`} aria-hidden="true" />
            Web Applications
          </Typography>
          <div className={`${classes.sectionContainer} ${classes.webSectionContainer}`}>
            <div className={classes.cardsGrid}>
              {webApplicationTemplates.map(template => (
                <div key={template.id} className={classes.templateCardWrap}>
                  <TemplateCard
                    template={toTemplateEntity(template)}
                    additionalLinks={[
                      { icon: DescriptionIcon, text: 'View TechDocs', url: '#' },
                      { icon: ChatIcon, text: 'Slack support', url: '#' },
                    ]}
                    onSelected={selected => navigate(`/create/templates/default/${selected.metadata.name}`)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
};
