import React, { Component, createContext } from 'react';
import moment from 'moment';

import * as service from 'v2/services/Notifications/Notifications';
import { ExtendedNotification, Notification } from 'v2/services/Notifications';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { notificationsConfigs } from './constants';

export interface ProviderState {
  currentNotification: ExtendedNotification | undefined;
  notifications: ExtendedNotification[];
  displayNotification(templateName: string, templateData?: object): void;
  dismissCurrentNotification(): void;
}

export const NotificationsContext = createContext({} as ProviderState);

export class NotificationsProvider extends Component {
  public state: ProviderState = {
    currentNotification: undefined,
    notifications: service.readAllNotifications() || [],
    displayNotification: (templateName: string, templateData?: object) =>
      this.displayNotification(templateName, templateData),
    dismissCurrentNotification: () => this.dismissCurrentNotification()
  };

  public componentDidMount() {
    this.refreshNotifications();
    this.getNotifications();
  }

  public displayNotification = (templateName: string, templateData?: object) => {
    // Dismiss previous notifications that need to be dismissed
    const notificationsToDismiss = this.state.notifications.filter(
      x => notificationsConfigs[x.template].dismissOnOverwrite && !x.dismissed
    );
    notificationsToDismiss.forEach(dismissableNotification => {
      this.dismissNotification(dismissableNotification);
    });

    // Create the notification object
    const notification: Notification = {
      template: templateName,
      templateData,
      dateDisplayed: new Date(),
      dismissed: false,
      dateDismissed: undefined
    };

    // If notification with this template already exists update it, otherwise create a new one
    const existingNotification = this.state.notifications.find(
      x => x.template === notification.template
    );

    if (existingNotification) {
      service.updateNotification(existingNotification.uuid, notification);
    } else {
      service.createNotification(notification);
    }

    // Track notification displayed event
    this.trackNotificationDisplayed(notificationsConfigs[templateName].analyticsEvent);
    this.getNotifications();
  };

  public dismissCurrentNotification = () => {
    const notification = this.state.currentNotification;
    if (notification) {
      this.dismissNotification(notification);
      this.getNotifications();
    }
  };

  public refreshNotifications = () => {
    this.state.notifications.forEach(notification => {
      const notificationConfig = notificationsConfigs[notification.template];

      // Dismiss one-time notifications
      if (notificationConfig.showOneTime) {
        this.dismissNotification(notification);
        return;
      }

      // Check conditions for repeating and non-repeating notifications, show notification if needed
      const shouldShowRepeatingNotification =
        notificationConfig.repeatInterval &&
        notification.dismissed &&
        notificationConfig.repeatInterval <=
          moment.duration(moment(new Date()).diff(moment(notification.dateDismissed))).asSeconds();

      const isNonrepeatingNotification =
        !notificationConfig.repeatInterval && !notification.dismissed;

      // Return if there is a condition and it is not met
      if (shouldShowRepeatingNotification || isNonrepeatingNotification) {
        if (notificationConfig.condition !== undefined && !notificationConfig.condition()) {
          return;
        }
        notification.dismissed = false;
        notification.dateDisplayed = new Date();
        service.updateNotification(notification.uuid, notification);
      }
    });
  };

  public dismissNotification = (notification: ExtendedNotification) => {
    notification.dismissed = true;
    notification.dateDismissed = new Date();
    service.updateNotification(notification.uuid, notification);
  };

  public render() {
    const { children } = this.props;
    return (
      <NotificationsContext.Provider value={this.state}>{children}</NotificationsContext.Provider>
    );
  }

  private getNotifications = () => {
    const notifications: ExtendedNotification[] = service.readAllNotifications() || [];

    this.setState({ notifications });
    const sortedNotifications = notifications.sort((a, b) => {
      return new Date(a.dateDisplayed).getTime() - new Date(b.dateDisplayed).getTime();
    });
    const visibleNotifications = sortedNotifications.filter(x => !x.dismissed);

    this.setState({ currentNotification: visibleNotifications[visibleNotifications.length - 1] });
  };

  private trackNotificationDisplayed = (notification: string) => {
    AnalyticsService.instance.track(
      ANALYTICS_CATEGORIES.NOTIFICATION,
      `${notification} notification displayed`
    );
  };
}