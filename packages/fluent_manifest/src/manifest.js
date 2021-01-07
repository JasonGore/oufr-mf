import React from "react";

const FluentManifest = {
  "7.147.0": "7147",
  "7.154.0": "7154",
  "8.0.0-beta.32": "8032"
}

export const FluentVersions = Object.keys(FluentManifest);

const FluentScope = "fluentui";

// TODO: should there be default values? determined by who (app, manifest, etc.)?
export const FluentManifestContext = React.createContext({});

// TODO: how do shared deps work with this approach? (react, react-dom, etc.)
// TODO: how would this work for non-component entities? is this too much overhead for objects/functions/etc?
function loadComponent(scope, module) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

const useDynamicScript = (args) => {
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!args.url) {
      return;
    }

    const element = document.createElement("script");

    element.src = args.url;
    element.type = "text/javascript";
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => {
      console.log(`Dynamic Script Loaded: ${args.url}`);
      setReady(true);
    };

    element.onerror = () => {
      console.error(`Dynamic Script Error: ${args.url}`);
      setReady(false);
      setFailed(true);
    };

    document.head.appendChild(element);

    // TODO: is this a possible "unloading" method?
    return () => {
      console.log(`Dynamic Script Removed: ${args.url}`);
      document.head.removeChild(element);
    };
  }, [args.url]);

  return {
    ready,
    failed,
  };
};

// TODO: Thought should be given to this function and how it would scale and be used in production.
//       Should it use React.Suspense in every export? Fallback behavior? etc.
// TODO: Need to reconcile system vs. component props. Use system props from context or static state?
function ComponentLoader(props) {
  if (!props.system) {
    return <h2>No system props specified</h2>;
  }

  if (!props.system.version) {
    return <h2>No version specified</h2>;
  }

  if (!props.manifestModule) {
    return <h2>No module specified</h2>;
  }

  if (!FluentManifest[props.system.version]) {
    return <h2>{FluentScope} {props.manifestModule} {props.system.version} not available</h2>;
  }

  const url = `http://localhost:${FluentManifest[props.system.version]}/remoteEntry.js`;
  const scope = FluentScope;

  const { ready, failed } = useDynamicScript({ url });

  if (!ready) {
    return <h2>Loading dynamic script: {url}</h2>;
  }

  if (failed) {
    // TODO: this doesn't seem to work on failure, doesn't work in original example either
    return <h2>Failed to load dynamic script: {url}</h2>;
  }

  const Component = React.lazy(
    loadComponent(FluentScope, props.manifestModule)
  );

  return (
    <React.Suspense>
      {props.system.version}
      <Component {...props} />
    </React.Suspense>
  );
}

const FluentComponent = (props) => {
  return (
    <FluentManifestContext.Consumer>
      {system =>
      <ComponentLoader system={system} {...props} />}
    </FluentManifestContext.Consumer>
  );
}

export { FluentComponent };
