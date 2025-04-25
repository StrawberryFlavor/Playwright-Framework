pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.40.0-jammy'
        }
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')
    }
    
    stages {
        stage('安装依赖') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('测试') {
            parallel {
                stage('Chrome') {
                    steps {
                        sh 'LOG_PRESET=quiet npm run test-chrome'
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                            archiveArtifacts artifacts: 'logs/**', allowEmptyArchive: true
                        }
                        failure {
                            archiveArtifacts artifacts: 'screenshots/**', allowEmptyArchive: true
                        }
                    }
                }
                stage('Firefox') {
                    steps {
                        sh 'LOG_PRESET=quiet npm run test-firefox'
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                            archiveArtifacts artifacts: 'logs/**', allowEmptyArchive: true
                        }
                        failure {
                            archiveArtifacts artifacts: 'screenshots/**', allowEmptyArchive: true
                        }
                    }
                }
                stage('WebKit') {
                    steps {
                        sh 'LOG_PRESET=quiet npm run test-webkit'
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                            archiveArtifacts artifacts: 'logs/**', allowEmptyArchive: true
                        }
                        failure {
                            archiveArtifacts artifacts: 'screenshots/**', allowEmptyArchive: true
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            junit 'test-results/**/*.xml'
        }
    }
}