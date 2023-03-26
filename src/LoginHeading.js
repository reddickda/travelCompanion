import React from "react";
import { Grid, Card, Heading } from "@aws-amplify/ui-react"
import './Header.css';

export default function LoginHeading() {
  return (
    <>
      <Card variation={'elevated'} style={{ borderRadius: 0, backgroundColor: '#3f4343', position: 'fixed', top: 0, left:0, zIndex: 9000, width: '100%' }}>
        {/* <Flex alignItems={'center'} justifyContent={'space-between'}> */}
        <Grid height={50} justifyContent={'center'} alignItems={'center'} columnGap="0.5rem" templateColumns={"1fr"}>
          <Heading color='#bcbec2' textAlign={'center'} level={6}>Welcome to App Name</Heading>
        </Grid>
      </Card>
      <Card variation={'elevated'} style={{ borderRadius: 0, backgroundColor: '#191a1a', position: 'fixed', top: 50, left:0, zIndex: 9000, width: '100%' }}>
        {/* <Flex alignItems={'center'} justifyContent={'space-between'}> */}
        <Grid height={50} justifyContent={'center'} alignItems={'center'} columnGap="0.5rem" templateColumns={"1fr"}>
          <Heading color='#bcbec2' textAlign={'center'} level={6}>App Name allows you to connect with friends and show you their adventures.</Heading>
        </Grid>
      </Card>
      <Card variation={'elevated'} style={{ borderRadius: 0, backgroundColor: '#191a1a', position: 'fixed', top: 100, left:0, zIndex: 9000, width: '100%' }}>
        {/* <Flex alignItems={'center'} justifyContent={'space-between'}> */}
        <Grid height={50} justifyContent={'center'} alignItems={'center'} columnGap="0.5rem" templateColumns={"1fr"}>
          <Heading color='#bcbec2' textAlign={'center'} level={6}>Sign up now and start posting today!</Heading>
        </Grid>
      </Card>
    </>
  )
}
