package com.np.lms.config;

import reactor.blockhound.BlockHound;
import reactor.blockhound.integration.BlockHoundIntegration;

public class JHipsterBlockHoundIntegration implements BlockHoundIntegration {

    @Override
    public void applyTo(BlockHound.Builder builder) {
        builder.allowBlockingCallsInside("org.springframework.validation.beanvalidation.SpringValidatorAdapter", "validate");
        builder.allowBlockingCallsInside("com.np.lms.service.MailService", "sendEmailFromTemplate");
        builder.allowBlockingCallsInside("com.np.lms.security.DomainUserDetailsService", "createSpringSecurityUser");
        builder.allowBlockingCallsInside("org.mariadb.r2dbc.message.client.HandshakeResponse", "writeConnectAttributes");
        builder.allowBlockingCallsInside("org.mariadb.r2dbc.client.MariadbPacketDecoder", "decode");
        builder.allowBlockingCallsInside("org.springframework.web.reactive.result.method.InvocableHandlerMethod", "invoke");
        builder.allowBlockingCallsInside("org.springdoc.core.service.OpenAPIService", "build");
        builder.allowBlockingCallsInside("org.springdoc.core.service.AbstractRequestService", "build");
    }
}
