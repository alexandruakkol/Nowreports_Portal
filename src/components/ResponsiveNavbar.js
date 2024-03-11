import React from 'react'

const ResponsiveNavbar = (props) => {
    const {items, logo_el} = props;
  return (
    <nav style={styles.nav}>
        <>{logo_el}</>
        <div style={styles.div}>
            {items}
        </div>
    </nav>
  )
}

const styles = {
    nav:{
        userSelect: 'none',
        paddingLeft: '2vw',
        display: 'flex',
        height: '7vh',
        boxShadow: '0 1px 1px var(--BORDERS)',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%'
    },
    div:{
        gap: '33px',
        display: 'flex',
        width: '100%',
        justifyContent: 'center'
    }
}


export default ResponsiveNavbar