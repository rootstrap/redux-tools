import { useSelector } from 'react-redux'
import { LOADING } from './constants'

/**
 * useLoading hook
 *
 * @param {string} action Prefix for the action names
 *
 * @returns {boolean} Wether the action is loading
 *
 * @example
 * const isLoading = useStatus(getProfile)
 */

export default action =>
  useSelector(({ actionStatus }) => {
    const { status } = actionStatus[action] || {}
    return status === LOADING
  })
