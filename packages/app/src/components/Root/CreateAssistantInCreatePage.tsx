import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { CreateAssistantBanner } from './CreateAssistantBanner';

const MARKER_ATTR = 'data-platform-pal-mount';
const REGISTER_SLOT_SELECTOR = '[data-platform-pal-register-slot="true"]';

const normalize = (text: string | null | undefined) =>
  (text || '').replace(/\s+/g, ' ').trim().toLowerCase();

const relocateRegisterExistingComponentAction = () => {
  const slot = document.querySelector(REGISTER_SLOT_SELECTOR);
  if (!(slot instanceof HTMLElement)) {
    return;
  }

  const candidates = Array.from(document.querySelectorAll('a, button'));
  const registerAction = candidates.find(node => {
    if (!(node instanceof HTMLElement)) {
      return false;
    }

    if (slot.contains(node)) {
      return false;
    }

    return normalize(node.textContent).includes('register existing component');
  });

  if (!(registerAction instanceof HTMLElement)) {
    return;
  }

  // Move the original action so there is only one Register Existing Component button.
  slot.appendChild(registerAction);
};

const findCreateHeaderMountParent = () => {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  for (const heading of Array.from(headings)) {
    const text = heading.textContent?.toLowerCase() || '';
    if (!text.includes('create a new component')) {
      continue;
    }

    const headerBlock =
      heading.closest('header') ||
      heading.closest("div[class*='Header']") ||
      heading.parentElement;

    if (headerBlock?.parentElement) {
      return {
        parent: headerBlock.parentElement,
        after: headerBlock,
      };
    }
  }

  return null;
};

const ensureMountNode = () => {
  const existing = document.querySelector(`[${MARKER_ATTR}="true"]`);
  if (existing instanceof HTMLElement) {
    return existing;
  }

  const mount = document.createElement('div');
  mount.setAttribute(MARKER_ATTR, 'true');

  const target = findCreateHeaderMountParent();
  if (target) {
    target.parent.insertBefore(mount, target.after.nextSibling);
    return mount;
  }

  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  if (main instanceof HTMLElement) {
    const firstContainer = main.querySelector("div[class*='MuiContainer-root']");
    if (firstContainer instanceof HTMLElement) {
      firstContainer.insertBefore(mount, firstContainer.firstChild);
      return mount;
    }

    main.insertBefore(mount, main.firstChild);
    return mount;
  }

  return null;
};

export const CreateAssistantInCreatePage = () => {
  const location = useLocation();
  const isCreateRoute = location.pathname.startsWith('/create');
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isCreateRoute) {
      setMountNode(null);
      return;
    }

    let active = true;
    let observer: MutationObserver | undefined;
    let node: HTMLElement | null = null;

    const attach = () => {
      if (!active) {
        return;
      }

      const mount = ensureMountNode();
      if (!mount) {
        return;
      }

      node = mount;
      setMountNode(mount);
      relocateRegisterExistingComponentAction();
    };

    attach();

    observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      active = false;
      observer?.disconnect();
      setMountNode(null);
      if (node?.parentNode) {
        node.parentNode.removeChild(node);
      }
    };
  }, [isCreateRoute]);

  if (!isCreateRoute || !mountNode) {
    return null;
  }

  return createPortal(<CreateAssistantBanner embedded />, mountNode);
};
