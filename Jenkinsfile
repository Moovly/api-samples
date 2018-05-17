// This file is to host the demo on our documentation platform. You don't need this.

pipeline {
  agent { label 'ecs' }

  environment {
    CONTAINER_NAME = 'api-samples'
    CONTAINER_URL = '016352445818.dkr.ecr.eu-west-1.amazonaws.com/api-samples'
    CONTAINER_URL_NUMBER = "${CONTAINER_URL}:${BRANCH_NAME.replaceAll('[^a-zA-Z0-9-]', '').toLowerCase()}-${BUILD_NUMBER}"
    CONTAINER_URL_BRANCH = "${CONTAINER_URL}:${BRANCH_NAME.replaceAll('[^a-zA-Z0-9-]', '').toLowerCase()}"
    STACK_NAME = "${env.JOB_NAME}"
    BUILD_TAG_PARSED = "${env.BUILD_TAG.replaceAll('[^a-zA-Z0-9-]', '').toLowerCase()}"
    SENTRY_VERSION = "${BRANCH_NAME.replaceAll('[^a-zA-Z0-9-]', '').toLowerCase()}-${BUILD_NUMBER}"
  }

  stages {
    stage('Credentials/Meta') {
      steps {
        sh '$(aws ecr get-login --no-include-email --region eu-west-1)'
      }
    }

    stage('Build React') {
      steps {
        sh 'docker-compose -f automator-react/docker-compose.yml run --rm install'
        sh 'docker-compose -f automator-react/docker-compose.yml run --rm build'
      }
    }

    stage('Package React') {
      steps {
        sh 'docker build --pull -f Dockerfile.react -t ${BUILD_TAG_PARSED}-react .'
      }
    }

    stage('Register React') {
      steps {
        sh 'docker tag ${BUILD_TAG_PARSED}-react ${CONTAINER_URL_NUMBER}-react && docker push ${CONTAINER_URL_NUMBER}-react'
        sh 'docker tag ${BUILD_TAG_PARSED}-react ${CONTAINER_URL_BRANCH}-react && docker push ${CONTAINER_URL_BRANCH}-react'
      }
    }

    stage('Announce') {
      steps {
        script {
          currentBuild.description = "${CONTAINER_URL_NUMBER}-react | ${CONTAINER_URL_BRANCH}-react"
        }
      }
    }
  }
}