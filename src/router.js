// @flow

import React from 'react'

type LinkProps = {
  className?: string,
  to: string,
  children: any
}

type Route = {
  name: string,
  pattern: RegExp,
  action: Function
}

type Config = {
  routes: Array<Route>,
  onRoute?: Function,
  triggerForInitialState?: boolean
}

const ROUTER_MODE_PUSH = 'push'
const ROUTER_MODE_REPLACE = 'replace'

let config: Config

const getQueryString = (url): {} => window.location.search
  .replace(/^\?/, '')
  .split('&')
  .filter(x => x.length)
  .map(str => str.split('='))
  .reduce((out, pair) => ({ ...out, [pair[0]]: pair[1] }), {})

const triggerRouteAction = () => {
  const route = config.routes.find(r => r.pattern.test(window.location.pathname))
  if (route) {
    const matches = route.pattern.exec(window.location.pathname)
    const params = matches || {}
    const query = getQueryString()
    const actionResult = route.action(params, query, window.location.href)
    if (typeof config.onRoute === 'function') {
      config.onRoute(actionResult)
    }
  }
}

const setState = (newRoutePath: string, newTitle?: string, mode: string) => {
  const methodName = mode === ROUTER_MODE_REPLACE ? 'replaceState' : 'pushState'
  if (newRoutePath !== window.location.pathname) {
    window.history[methodName]({}, '', newRoutePath)
  }
  if (newTitle !== undefined) {
    const title = [];
    if (config.title && config.title.prefix) title.push(config.title.prefix);
    if (newTitle) title.push(newTitle);
    if (config.title && config.title.suffix) title.push(config.title.suffix);
    document.title = title.join(config.title.delim || ' | ');
  }
}

// ---------------------------------------------------------------------------
// External API

export const configure = (newConfig: Config) => {
  config = newConfig
  if (config.triggerForInitialState) {
    triggerRouteAction()
  }
}

export const replaceState = (newRoutePath: string, newTitle?: string) => setState(newRoutePath, newTitle, ROUTER_MODE_REPLACE)
export const pushState = (newRoutePath: string, newTitle?: string) => setState(newRoutePath, newTitle, ROUTER_MODE_PUSH)

export const Link = (props: LinkProps) => {
  const clickHandler = (evt) => {
    if (evt.shiftKey || evt.ctrlKey || evt.metaKey || evt.altKey || evt.nativeEvent.button === 1) return
    const route = config.routes.find(r => r.pattern.test(props.to))
    if (route) {
      evt.preventDefault()
      window.history.pushState({}, '', props.to)
      triggerRouteAction()
      window.scrollTo(0,0)
    }
  }
  return (
    <a
      className={props.className}
      href={props.to}
      onClick={clickHandler}
    >
      {props.children}
    </a>
  )
}

// ---------------------------------------------------------------------------
// Bind to external events

window.addEventListener('popstate', evt => triggerRouteAction())
