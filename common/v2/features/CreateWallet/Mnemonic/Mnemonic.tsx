import React, { Component, ReactType } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Layout } from 'v2/features';
import { MnemonicProvider, MnemonicContext } from './components';
import { MnemonicStages, mnemonicStageToComponentHash, mnemonicFlow } from './constants';

export default class CreateWallet extends Component<RouteComponentProps<{}>> {
  public state = {
    stage: MnemonicStages.SelectNetwork
  };

  public render() {
    const { stage } = this.state;
    const currentStep: number = mnemonicFlow.indexOf(stage) + 1;
    const ActivePanel: ReactType = mnemonicStageToComponentHash[stage];
    const actions = {
      onBack: this.regressToPreviousStage,
      onNext: this.advanceToNextStage,
      navigateToDashboard: this.navigateToDashboard
    };
    const isMnemonicPanel = [
      MnemonicStages.GeneratePhrase,
      MnemonicStages.BackUpPhrase,
      MnemonicStages.ConfirmPhrase
    ].includes(stage);

    return (
      <MnemonicProvider>
        <Layout centered={true}>
          <section className="CreateWallet">
            {isMnemonicPanel ? (
              <MnemonicContext.Consumer>
                {({ words, generateWords }) => (
                  <ActivePanel
                    currentStep={currentStep}
                    totalSteps={4}
                    words={words}
                    generateWords={generateWords}
                    {...actions}
                  />
                )}
              </MnemonicContext.Consumer>
            ) : (
              <ActivePanel currentStep={currentStep} totalSteps={4} {...actions} />
            )}
          </section>
        </Layout>
      </MnemonicProvider>
    );
  }

  private regressToPreviousStage = () => {
    const { history } = this.props;
    const { stage } = this.state;
    const currentIndex = mnemonicFlow.indexOf(stage);
    const previousStage = mnemonicFlow[currentIndex - 1];

    if (previousStage != null) {
      this.setState({ stage: previousStage });
    } else {
      history.push('/');
    }
  };

  private advanceToNextStage = () => {
    const { stage } = this.state;
    const currentIndex = mnemonicFlow.indexOf(stage);
    const nextStage = mnemonicFlow[currentIndex + 1];

    if (nextStage != null) {
      this.setState({ stage: nextStage });
    }
  };

  private navigateToDashboard = () => {
    const { history } = this.props;
    history.replace('/dashboard');
  };
}