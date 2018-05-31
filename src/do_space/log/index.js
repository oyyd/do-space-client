const isProd = process.env.NODE_ENV === 'production'

function log(level, ...args) {
  if (level === 'warn') {
    console.log(...args)
  } else if (level === 'error') {
    console.error(...args)
  }

  if (!isProd) {
    console.log(...args)
  }
}

export const debug = log.bind(null, 'debug')

export const info = log.bind(null, 'info')

export const warn = log.bind(null, 'warn')

export const error = log.bind(null, 'error')
