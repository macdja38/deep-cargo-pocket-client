import React, { Component } from "react";
import PropTypes from "prop-types";
import { Box, Button, Flex, Link, Text } from "@chakra-ui/core";

import { api } from "../../consts";

class Login extends Component {
  render() {
    if (this.props.user) {
      return (
        <Box py={4} bg="gray.50">
          <Flex
            width="100vh"
            mx="auto"
            maxWidth="60em"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontWeight="bold" pl={[4, 4, 4, 16]}>
              Logged in as: {decodeURIComponent(this.props.user.username)}
            </Text>
            <Link href={`${api}/logout`} pr={[4, 4, 4, 16]}>
              Log out
            </Link>
          </Flex>
        </Box>
      );
    }
    return (
      <Box>
        <Button
          variantColor="blue"
          rightIcon="external-link"
          size="lg"
          mx="auto"
          my={16}
          display="block"
          onClick={() => (window.location.href = `${api}/login`)}
        >
          Log in with Pocket
        </Button>
      </Box>
    );
  }
}

Login.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired
  })
};

export default Login;
