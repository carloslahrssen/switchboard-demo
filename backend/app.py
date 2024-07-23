from flask import Flask, request
from json import dumps
from datetime import datetime

from database.db import init_db, db_session
from database.models import Donations

app = Flask(__name__)

print('Starting flask app')

init_db()

@app.post("/actblue_donation")
def actblue_donation_webhook():
    # Check login for user and password
    if verify_login(request.authorization) != True:
        return dumps({'error': 'Invalid Credentials'}), 401, {'ContentType': 'application/json'}
    
    donations_json = request.get_json()
    lineitem_id = donations_json['lineitems'][0]['lineitemId']     

    order_number = donations_json['contribution']['orderNumber']
    paid_at = donations_json['lineitems'][0]['paidAt']

    donations = Donations.query.all()

    for donation in donations:
        if donation.lineitem_id == str(lineitem_id):
            print('Report this')
            return dumps({'error': 'lineitem already exists in db'}), 422, {'ContentType':'application/json'} 


        # Had issues with datetimes, still trying to understand them in python so the solution below was not ideal
        # I think the main issue here is that sqlite doesn't know how to include timezones. Using something like postgres would preserve timezones.
        paid_at_timezone = datetime.strptime(paid_at, "%Y-%m-%dT%H:%M:%S%z").tzinfo
        donation_paid_at_with_timezone = donation.paid_at.replace(tzinfo = paid_at_timezone).strftime("%Y-%m-%dT%H:%M:%S%z")
        normalize_request_paid_at = paid_at[:-3] + paid_at[-2:]

        print(donation_paid_at_with_timezone)
        print(normalize_request_paid_at)

        if (order_number == donation.order_number) and (normalize_request_paid_at == donation_paid_at_with_timezone):
            return dumps({'error': 'Order number and paid at is already unique and can not be duplicated'}), 422, {'ContentType':'application/json'} 
    # Store to DB
    donation = Donations(
        donor_firstname = donations_json['donor']['firstname'],
        donor_lastname = donations_json['donor']['lastname'],
        donor_addr1 = donations_json['donor']['addr1'],
        donor_city = donations_json['donor']['city'],
        donor_state = donations_json['donor']['state'],
        donor_zip = donations_json['donor']['zip'],
        donor_is_eligible_for_express_lane = donations_json['donor']['isEligibleForExpressLane'],
        donor_email = donations_json['donor']['email'],
        donor_phone = donations_json['donor']['phone'],
        created_at = datetime.strptime(donations_json['contribution']['createdAt'], '%Y-%m-%dT%H:%M:%S%z'),
        order_number = donations_json['contribution']['orderNumber'],
        contribution_form = donations_json['contribution']['contributionForm'],
        refcodes = donations_json['contribution']['refcodes'],
        refcode = donations_json['contribution']['refcode'],
        recurring_period = donations_json['contribution']['recurringPeriod'],
        recurring_duration = donations_json['contribution']['recurringDuration'],
        is_paypal = donations_json['contribution']['isPaypal'],
        is_mobile = donations_json['contribution']['isMobile'],
        is_express = donations_json['contribution']['isExpress'],
        with_express_lane = donations_json['contribution']['withExpressLane'],
        express_signup = donations_json['contribution']['expressSignup'],
        unique_identifier = donations_json['contribution']['uniqueIdentifier'],
        status = donations_json['contribution']['status'],
        text_message_option = donations_json['contribution']['textMessageOption'],
        custom_fields = donations_json['contribution']['customFields'],
        sequence = donations_json['lineitems'][0]['sequence'],
        entity_id = donations_json['lineitems'][0]['entityId'],
        committee_name =donations_json['lineitems'][0]['committeeName'],
        amount = donations_json['lineitems'][0]['amount'],
        paid_at = datetime.strptime(donations_json['lineitems'][0]['paidAt'], '%Y-%m-%dT%H:%M:%S%z'),
        lineitem_id = donations_json['lineitems'][0]['lineitemId'],
        form_name = donations_json['form']['name'],
        form_managing_entity_name = donations_json['form']['managingEntityName'],
        form_managing_entity_committee_name = donations_json['form']['managingEntityCommitteeName'],
    )
    db_session.add(donation)
    db_session.commit()

    return dumps({'success':True}), 200, {'ContentType':'application/json'} 

def verify_login(authorization):
    if authorization == None or (authorization['username'] != 'actblue' or authorization['password'] != 'CHANGEME'):
        return False
    
    return True
@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()