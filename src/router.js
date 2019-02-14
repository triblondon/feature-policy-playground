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
    console.log('Router:', route.name, params, query, window.location.href)
    const actionResult = route.action(params, query, window.location.href)
    if (typeof config.onRoute === 'function') {
      config.onRoute(actionResult)
    }
  }
}

const setState = (newRoutePath: string, mode: string) => {
  const methodName = mode === ROUTER_MODE_REPLACE ? 'replaceState' : 'pushState'
  if (newRoutePath !== window.location.pathname) {
    window.history[methodName]({}, '', newRoutePath)
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

export const replaceState = (newRoutePath: string) => setState(newRoutePath, ROUTER_MODE_REPLACE)
export const pushState = (newRoutePath: string) => setState(newRoutePath, ROUTER_MODE_PUSH)

export const Link = (props: LinkProps) => {
  const clickHandler = (evt) => {
    if (evt.shiftKey || evt.controlKey || evt.metakey || evt.altKey) return
    const route = config.routes.find(r => r.pattern.test(props.to))
    if (route) {
      evt.preventDefault()
      window.history.pushState({}, '', props.to)
      triggerRouteAction()
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
