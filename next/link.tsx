import { jsx as _jsx } from "react/jsx-runtime"
import { forwardRef } from "react"

const Link = forwardRef(
  /**
   * @param {Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string }} props
   * @param {React.ForwardedRef<HTMLAnchorElement>} ref
   */
  function Link(props, ref) {
    const { href, ...rest } = props
    return _jsx("a", {
      href: href,
      ref: ref,
      ...rest,
    })
  },
)

Link.displayName = "Link"

export default Link
